import { Router } from 'express';
import {
  initiateCall,
  respondToCall,
  endCall,
  getIceServers,
  getCallHistory,
  getCallById
} from '../controllers/callController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.post('/initiate', initiateCall);
router.post('/:callId/respond', respondToCall);
router.post('/:callId/end', endCall);
router.get('/ice-servers', getIceServers);
router.get('/history', getCallHistory);
router.get('/:callId', getCallById);

export default router;
