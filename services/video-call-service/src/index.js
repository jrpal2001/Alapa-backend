import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env.js';
import { connectDB } from './config/db.js';
import callRoutes from './routes/callRoutes.js';
import { createLogger, errorHandler, sendSuccess } from '@alapa/shared';

const logger = createLogger(config.serviceName);
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
  logger.info(`[Video-Service] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoints
app.get(['/health', '/api/calls/health'], (req, res) => {
  sendSuccess(res, { service: config.serviceName, status: 'healthy', uptime: process.uptime() }, 'Video Call Service active');
});

// Routes
app.use('/api/calls', callRoutes);

// Global Error Handler
app.use(errorHandler(logger));

// Connect Database & Start Server
const startServer = async () => {
  await connectDB();
  app.listen(config.port, () => {
    logger.info(`🚀 Video Call Service running on port ${config.port} in ${config.nodeEnv} mode`);
  });
};

startServer();
