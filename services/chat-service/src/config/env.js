import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 8003,
  nodeEnv: process.env.NODE_ENV || 'development',
  serviceName: 'chat-service',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/alapa_chat',
  userServiceUrl: process.env.USER_SERVICE_URL || 'http://localhost:8001',
  notificationServiceUrl: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:8005'
};
