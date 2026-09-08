import { Router } from 'express';
import {
  createConversation,
  getConversations,
  getMessages,
  sendMessage,
  markAsRead,
  deleteConversation
} from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.post('/conversations', createConversation);
router.get('/conversations', getConversations);
router.get('/conversations/:conversationId/messages', getMessages);
router.post('/conversations/:conversationId/read', markAsRead);
router.delete('/conversations/:conversationId', deleteConversation);
router.post('/messages', sendMessage);

export default router;
