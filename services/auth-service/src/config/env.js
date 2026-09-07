import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 8001,
  nodeEnv: process.env.NODE_ENV || 'development',
  serviceName: 'auth-service',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/alapa_auth',
  jwtSecret: process.env.JWT_SECRET || 'supersecretkey',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'superrefreshsecretkey'
};
