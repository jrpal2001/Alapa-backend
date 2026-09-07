import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  port: process.env.PORT || 8003,
  nodeEnv: process.env.NODE_ENV || 'development',
  serviceName: 'chat-service',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/alapa_chat',
  userServiceUrl: process.env.USER_SERVICE_URL || 'http://127.0.0.1:8001',
  notificationServiceUrl: process.env.NOTIFICATION_SERVICE_URL || 'http://127.0.0.1:8005'
};
