import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env.js';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { createLogger, errorHandler, sendSuccess } from '@alapa/shared';

const logger = createLogger(config.serviceName);
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  logger.info(`[Auth-Service] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoints
app.get(['/health', '/api/auth/health', '/api/users/health'], (req, res) => {
  sendSuccess(res, { service: config.serviceName, status: 'healthy', uptime: process.uptime() }, 'Auth & User Service active');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Global Error Handler
app.use(errorHandler(logger));

// Connect Database & Start Server
const startServer = async () => {
  await connectDB();
  app.listen(config.port, () => {
    logger.info(`🚀 Auth & User Service running on port ${config.port} in ${config.nodeEnv} mode`);
  });
};

startServer();
