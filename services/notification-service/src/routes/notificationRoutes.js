import { Router } from 'express';
import { sendChatNotification, sendCallNotification } from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.post('/send-chat', sendChatNotification);
router.post('/send-call', sendCallNotification);

export default router;
