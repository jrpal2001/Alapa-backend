import mongoose from 'mongoose';
import { createLogger } from '@alapa/shared';
import { config } from './env.js';

const logger = createLogger('auth-service-db');

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri);
    logger.info(`🍃 MongoDB Connected: ${conn.connection.host} [${conn.connection.name}]`);
    return conn;
  } catch (error) {
    logger.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};
