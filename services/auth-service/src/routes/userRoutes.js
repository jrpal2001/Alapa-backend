import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  getUserById,
  searchUsers,
  addFcmToken,
  removeFcmToken,
  blockUser,
  unblockUser
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.get('/me', getProfile);
router.patch('/me', updateProfile);
router.get('/search', searchUsers);
router.get('/:userId', getUserById);
router.post('/fcm-token', addFcmToken);
router.delete('/fcm-token', removeFcmToken);
router.post('/:userId/block', blockUser);
router.delete('/:userId/block', unblockUser);

export default router;
