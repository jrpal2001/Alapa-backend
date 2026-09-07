import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 8005,
  nodeEnv: process.env.NODE_ENV || 'development',
  serviceName: 'notification-service',
  firebaseServiceAccountKey: process.env.FIREBASE_SERVICE_ACCOUNT_KEY || ''
};
