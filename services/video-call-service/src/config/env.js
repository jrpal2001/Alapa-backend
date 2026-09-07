import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  port: process.env.PORT || 8004,
  nodeEnv: process.env.NODE_ENV || 'development',
  serviceName: 'video-call-service',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/alapa_video',
  userServiceUrl: process.env.USER_SERVICE_URL || 'http://127.0.0.1:8001',
  notificationServiceUrl: process.env.NOTIFICATION_SERVICE_URL || 'http://127.0.0.1:8005',
  stunServer: process.env.STUN_SERVER || 'stun:stun.l.google.com:19302',
  turnServer: process.env.TURN_SERVER || ''
};
