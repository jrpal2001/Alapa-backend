import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 8004,
  nodeEnv: process.env.NODE_ENV || 'development',
  serviceName: 'video-call-service',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/alapa_video',
  userServiceUrl: process.env.USER_SERVICE_URL || 'http://localhost:8001',
  notificationServiceUrl: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:8005',
  stunServer: process.env.STUN_SERVER || 'stun:stun.l.google.com:19302',
  turnServer: process.env.TURN_SERVER || ''
};
