import { Call } from '../models/Call.js';
import { config } from '../config/env.js';
import { syncCallStateToFirestore } from '../config/firebase.js';
import { sendSuccess, BadRequestError, NotFoundError, ForbiddenError, HTTP_STATUS } from '@alapa/shared';

export const initiateCall = async (req, res, next) => {
  try {
    const { receiverId, type = 'video' } = req.body;
    const currentUserId = req.user._id;

    if (!receiverId) {
      throw new BadRequestError('Receiver user ID is required');
    }

    if (receiverId === currentUserId) {
      throw new BadRequestError('You cannot call yourself');
    }

    const call = await Call.create({
      callerId: currentUserId,
      receiverId,
      type,
      status: 'ringing',
      startedAt: new Date()
    });

    // Sync initial ringing state to Firestore signaling channel
    await syncCallStateToFirestore(call._id, call);

    // Trigger push notification to receiver via Notification Service if configured
    try {
      if (config.notificationServiceUrl) {
        await fetch(`${config.notificationServiceUrl}/api/notifications/send-call`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: req.headers.authorization
          },
          body: JSON.stringify({
            fcmTokens: [], // Target service or client will supply tokens
            callerName: req.user.name || 'Incoming Call',
            callId: call._id.toString(),
            callType: type
          })
        });
      }
    } catch (err) {
      // Non-blocking notification dispatch log
    }

    return sendSuccess(res, { call }, 'Call initiated successfully', HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
};

export const respondToCall = async (req, res, next) => {
  try {
    const { callId } = req.params;
    const { action } = req.body; // 'accept' or 'reject'
    const currentUserId = req.user._id;

    if (!action || !['accept', 'reject'].includes(action)) {
      throw new BadRequestError("Action must be either 'accept' or 'reject'");
    }

    const call = await Call.findById(callId);
    if (!call) {
      throw new NotFoundError('Call session not found');
    }

    if (call.receiverId !== currentUserId) {
      throw new ForbiddenError('Only the call receiver can respond to this call');
    }

    if (call.status !== 'ringing') {
      throw new BadRequestError(`Cannot respond to call in '${call.status}' state`);
    }

    if (action === 'accept') {
      call.status = 'accepted';
      call.answeredAt = new Date();
    } else {
      call.status = 'rejected';
      call.endedAt = new Date();
      call.endedBy = currentUserId;
    }

    await call.save();
    await syncCallStateToFirestore(call._id, call);

    return sendSuccess(res, { call }, `Call ${action}ed successfully`);
  } catch (error) {
    next(error);
  }
};

export const endCall = async (req, res, next) => {
  try {
    const { callId } = req.params;
    const currentUserId = req.user._id;

    const call = await Call.findById(callId);
    if (!call) {
      throw new NotFoundError('Call session not found');
    }

    if (call.callerId !== currentUserId && call.receiverId !== currentUserId) {
      throw new ForbiddenError('You are not a participant in this call');
    }

    if (['ended', 'cancelled', 'rejected', 'missed'].includes(call.status)) {
      return sendSuccess(res, { call }, 'Call is already terminated');
    }

    const now = new Date();
    call.endedAt = now;
    call.endedBy = currentUserId;

    if (call.status === 'ringing') {
      call.status = call.callerId === currentUserId ? 'cancelled' : 'missed';
      call.duration = 0;
    } else if (call.status === 'accepted') {
      call.status = 'ended';
      const start = call.answeredAt ? new Date(call.answeredAt) : new Date(call.startedAt);
      call.duration = Math.max(0, Math.floor((now.getTime() - start.getTime()) / 1000));
    }

    await call.save();
    await syncCallStateToFirestore(call._id, call);

    return sendSuccess(res, { call }, 'Call session ended');
  } catch (error) {
    next(error);
  }
};

export const getIceServers = async (req, res, next) => {
  try {
    const iceServers = [
      {
        urls: [
          config.stunServer || 'stun:stun.l.google.com:19302',
          'stun:stun1.l.google.com:19302'
        ]
      }
    ];

    if (config.turnServer) {
      iceServers.push({
        urls: [config.turnServer],
        username: config.turnUsername,
        credential: config.turnCredential
      });
    }

    return sendSuccess(res, { iceServers }, 'STUN/TURN ICE configuration');
  } catch (error) {
    next(error);
  }
};

export const getCallHistory = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;
    const { page = 1, limit = 20, type, status } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(50, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const filter = {
      $or: [{ callerId: currentUserId }, { receiverId: currentUserId }]
    };

    if (type && ['audio', 'video'].includes(type)) {
      filter.type = type;
    }

    if (status && ['ringing', 'accepted', 'rejected', 'missed', 'cancelled', 'ended'].includes(status)) {
      filter.status = status;
    }

    const [calls, total] = await Promise.all([
      Call.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Call.countDocuments(filter)
    ]);

    const meta = {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum)
    };

    return sendSuccess(res, calls, 'Call history retrieved', 200, meta);
  } catch (error) {
    next(error);
  }
};

export const getCallById = async (req, res, next) => {
  try {
    const { callId } = req.params;
    const currentUserId = req.user._id;

    const call = await Call.findById(callId);
    if (!call) {
      throw new NotFoundError('Call session not found');
    }

    if (call.callerId !== currentUserId && call.receiverId !== currentUserId) {
      throw new ForbiddenError('You are not authorized to view this call');
    }

    return sendSuccess(res, { call }, 'Call details retrieved');
  } catch (error) {
    next(error);
  }
};
