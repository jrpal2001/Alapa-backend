import { Conversation } from '../models/Conversation.js';
import { Message } from '../models/Message.js';
import { syncMessageToFirestore } from '../config/firebase.js';
import { sendSuccess, BadRequestError, NotFoundError, ForbiddenError, HTTP_STATUS } from '@alapa/shared';

export const createConversation = async (req, res, next) => {
  try {
    const { recipientId } = req.body;
    const currentUserId = req.user._id;

    if (!recipientId) {
      throw new BadRequestError('Recipient user ID is required');
    }

    if (recipientId === currentUserId) {
      throw new BadRequestError('You cannot create a conversation with yourself');
    }

    // Check if 1-to-1 conversation already exists between participants
    let conversation = await Conversation.findOne({
      type: 'one_to_one',
      participants: { $all: [currentUserId, recipientId], $size: 2 }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        type: 'one_to_one',
        participants: [currentUserId, recipientId],
        unreadCounts: {
          [currentUserId]: 0,
          [recipientId]: 0
        }
      });
    }

    return sendSuccess(res, { conversation }, 'Conversation retrieved', HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
};

export const getConversations = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;
    const { page = 1, limit = 20 } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(50, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const filter = { participants: currentUserId };

    const [conversations, total] = await Promise.all([
      Conversation.find(filter).sort({ lastMessageAt: -1 }).skip(skip).limit(limitNum),
      Conversation.countDocuments(filter)
    ]);

    const meta = {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum)
    };

    return sendSuccess(res, conversations, 'Conversations list', 200, meta);
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const currentUserId = req.user._id;
    const { page = 1, limit = 30 } = req.query;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new NotFoundError('Conversation not found');
    }

    if (!conversation.participants.includes(currentUserId)) {
      throw new ForbiddenError('You are not a participant in this conversation');
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 30));
    const skip = (pageNum - 1) * limitNum;

    const filter = { conversationId };

    const [messages, total] = await Promise.all([
      Message.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Message.countDocuments(filter)
    ]);

    const meta = {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum)
    };

    return sendSuccess(res, messages.reverse(), 'Messages history', 200, meta);
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const { conversationId, text = '', type = 'text', mediaUrl = '' } = req.body;
    const currentUserId = req.user._id;

    if (!conversationId) {
      throw new BadRequestError('Conversation ID is required');
    }

    if (!text && !mediaUrl) {
      throw new BadRequestError('Message text or media URL is required');
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new NotFoundError('Conversation not found');
    }

    if (!conversation.participants.includes(currentUserId)) {
      throw new ForbiddenError('You are not a participant in this conversation');
    }

    // Create durable Message document in MongoDB
    const message = await Message.create({
      conversationId,
      senderId: currentUserId,
      type,
      text,
      mediaUrl,
      status: 'sent',
      readBy: [currentUserId]
    });

    // Update Conversation metadata
    conversation.lastMessage = {
      text: type === 'text' ? text : `[${type}]`,
      senderId: currentUserId,
      type,
      createdAt: message.createdAt
    };
    conversation.lastMessageAt = message.createdAt;

    // Increment unread counts for other participants
    conversation.participants.forEach((participantId) => {
      if (participantId !== currentUserId) {
        const currentCount = conversation.unreadCounts.get(participantId) || 0;
        conversation.unreadCounts.set(participantId, currentCount + 1);
      }
    });

    await conversation.save();

    // Sync to Firestore Realtime Projection Layer
    await syncMessageToFirestore(conversationId, message);

    return sendSuccess(res, { message }, 'Message sent successfully', HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const currentUserId = req.user._id;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new NotFoundError('Conversation not found');
    }

    if (!conversation.participants.includes(currentUserId)) {
      throw new ForbiddenError('You are not a participant in this conversation');
    }

    // Update unread messages sent by others to 'read'
    await Message.updateMany(
      {
        conversationId,
        senderId: { $ne: currentUserId },
        status: { $ne: 'read' }
      },
      {
        $set: { status: 'read' },
        $addToSet: { readBy: currentUserId }
      }
    );

    // Reset unread count for current user
    conversation.unreadCounts.set(currentUserId, 0);
    await conversation.save();

    return sendSuccess(res, null, 'Messages marked as read');
  } catch (error) {
    next(error);
  }
};

export const deleteConversation = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const currentUserId = req.user._id;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new NotFoundError('Conversation not found');
    }

    if (!conversation.participants.includes(currentUserId)) {
      throw new ForbiddenError('You are not a participant in this conversation');
    }

    await Message.deleteMany({ conversationId });
    await Conversation.findByIdAndDelete(conversationId);

    return sendSuccess(res, null, 'Conversation deleted');
  } catch (error) {
    next(error);
  }
};
