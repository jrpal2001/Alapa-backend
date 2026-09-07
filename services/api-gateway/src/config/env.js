import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  port: process.env.PORT || 8000,
  nodeEnv: process.env.NODE_ENV || 'development',
  serviceName: 'api-gateway',
  services: {
    authUser: process.env.AUTH_USER_SERVICE_URL || 'http://127.0.0.1:8001',
    chat: process.env.CHAT_SERVICE_URL || 'http://127.0.0.1:8003',
    video: process.env.VIDEO_SERVICE_URL || 'http://127.0.0.1:8004',
    notification: process.env.NOTIFICATION_SERVICE_URL || 'http://127.0.0.1:8005'
  }
};
