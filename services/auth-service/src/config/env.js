import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load service-specific .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  port: process.env.PORT || 8001,
  nodeEnv: process.env.NODE_ENV || 'development',
  serviceName: 'auth-service',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/alapa_auth_user',
  jwtSecret: process.env.JWT_SECRET || 'supersecretkey',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'superrefreshsecretkey',
  googleClientId: process.env.GOOGLE_CLIENT_ID || ''
};
