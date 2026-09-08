import mongoose from 'mongoose';
import { createLogger } from '@alapa/shared';
import { config } from './env.js';

const logger = createLogger('chat-service-db');

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri);
    logger.info(`🍃 MongoDB Connected (Chat Service): ${conn.connection.host} [${conn.connection.name}]`);
    return conn;
  } catch (error) {
    logger.error(`❌ MongoDB Connection Error (Chat Service): ${error.message}`);
    process.exit(1);
  }
};
