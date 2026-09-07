import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 8000,
  nodeEnv: process.env.NODE_ENV || 'development',
  serviceName: 'api-gateway',
  services: {
    authUser: process.env.AUTH_USER_SERVICE_URL || 'http://localhost:8001',
    chat: process.env.CHAT_SERVICE_URL || 'http://localhost:8003',
    video: process.env.VIDEO_SERVICE_URL || 'http://localhost:8004',
    notification: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:8005'
  }
};
