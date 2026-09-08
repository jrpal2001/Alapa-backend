import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env.js';
import notificationRoutes from './routes/notificationRoutes.js';
import { createLogger, errorHandler, sendSuccess } from '@alapa/shared';

const logger = createLogger(config.serviceName);
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  logger.info(`[Notification-Service] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint
app.get(['/health', '/api/notifications/health'], (req, res) => {
  sendSuccess(res, { service: config.serviceName, status: 'healthy', uptime: process.uptime() }, 'Notification Service active');
});

// Routes
app.use('/api/notifications', notificationRoutes);

// Global Error Handler
app.use(errorHandler(logger));

app.listen(config.port, () => {
  logger.info(`🚀 Notification Service running on port ${config.port} in ${config.nodeEnv} mode`);
});
