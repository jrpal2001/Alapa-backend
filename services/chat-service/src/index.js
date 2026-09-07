import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env.js';
import { createLogger, errorHandler, sendSuccess } from '@alapa/shared';

const logger = createLogger(config.serviceName);
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoints
app.get(['/health', '/api/chat/health'], (req, res) => {
  sendSuccess(res, { service: config.serviceName, status: 'healthy', uptime: process.uptime() }, 'Chat Service active');
});

app.use(errorHandler(logger));

app.listen(config.port, () => {
  logger.info(`🚀 Chat Service running on port ${config.port} in ${config.nodeEnv} mode`);
});
