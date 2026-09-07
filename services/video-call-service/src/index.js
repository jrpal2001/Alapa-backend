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

app.get('/health', (req, res) => {
  sendSuccess(res, { service: config.serviceName, status: 'healthy', uptime: process.uptime() }, 'Video Call Service active');
});

app.use(errorHandler(logger));

app.listen(config.port, () => {
  logger.info(`🚀 Video Call Service running on port ${config.port} in ${config.nodeEnv} mode`);
});
