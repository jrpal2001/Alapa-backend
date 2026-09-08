import { sendPushNotification } from '../config/fcm.js';
import { sendSuccess, BadRequestError } from '@alapa/shared';

export const sendChatNotification = async (req, res, next) => {
  try {
    const { fcmTokens, senderName, text, conversationId } = req.body;

    if (!fcmTokens || !Array.isArray(fcmTokens)) {
      throw new BadRequestError('fcmTokens array is required');
    }

    if (!senderName) {
      throw new BadRequestError('senderName is required');
    }

    const title = senderName;
    const body = text || 'Sent a media attachment';
    const data = {
      type: 'chat',
      conversationId: conversationId ? conversationId.toString() : ''
    };

    const result = await sendPushNotification({
      tokens: fcmTokens,
      title,
      body,
      data
    });

    return sendSuccess(res, { result }, 'Chat push notification dispatched');
  } catch (error) {
    next(error);
  }
};

export const sendCallNotification = async (req, res, next) => {
  try {
    const { fcmTokens, callerName, callId, callType = 'video' } = req.body;

    if (!fcmTokens || !Array.isArray(fcmTokens)) {
      throw new BadRequestError('fcmTokens array is required');
    }

    if (!callerName || !callId) {
      throw new BadRequestError('callerName and callId are required');
    }

    const title = `Incoming ${callType.toUpperCase()} Call`;
    const body = `${callerName} is calling you...`;
    const data = {
      type: 'call',
      callId: callId.toString(),
      callType,
      callerName
    };

    const result = await sendPushNotification({
      tokens: fcmTokens,
      title,
      body,
      data
    });

    return sendSuccess(res, { result }, 'Call push notification dispatched');
  } catch (error) {
    next(error);
  }
};
