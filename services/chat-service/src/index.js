import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env.js';
import { connectDB } from './config/db.js';
import chatRoutes from './routes/chatRoutes.js';
import { createLogger, errorHandler, sendSuccess } from '@alapa/shared';

const logger = createLogger(config.serviceName);
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
  logger.info(`[Chat-Service] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoints
app.get(['/health', '/api/chat/health'], (req, res) => {
  sendSuccess(res, { service: config.serviceName, status: 'healthy', uptime: process.uptime() }, 'Chat Service active');
});

// Routes
app.use('/api/chat', chatRoutes);

// Global Error Handler
app.use(errorHandler(logger));

// Connect Database & Start Server
const startServer = async () => {
  await connectDB();
  app.listen(config.port, () => {
    logger.info(`🚀 Chat Service running on port ${config.port} in ${config.nodeEnv} mode`);
  });
};

startServer();
