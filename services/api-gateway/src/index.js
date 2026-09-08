import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import proxy from 'express-http-proxy';
import rateLimit from 'express-rate-limit';
import { config } from './config/env.js';
import { createLogger, errorHandler, sendSuccess } from '@alapa/shared';

const logger = createLogger(config.serviceName);
const app = express();

app.use(helmet());
app.use(cors());

// Global Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // max 200 requests per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests from this IP, please try again later.' }
});

// Auth Sensitive Endpoint Rate Limiter (Brute-force mitigation)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // max 20 login/register attempts per 15 mins per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many authentication attempts, please try again after 15 minutes.' }
});

app.use(limiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Request Logger Middleware
app.use((req, res, next) => {
  logger.info(`[Gateway] ${req.method} ${req.originalUrl}`);
  next();
});

// Proxy Route Handler Helper
const createProxy = (targetUrl, pathPrefix) => {
  return proxy(targetUrl, {
    proxyReqPathResolver: (req) => `${pathPrefix}${req.url}`,
    proxyErrorHandler: (err, res, next) => {
      logger.error(`[Gateway Proxy Error] Target: ${targetUrl}${pathPrefix} - ${err.message}`);
      res.status(503).json({
        success: false,
        message: `Service at ${pathPrefix} is currently unavailable`
      });
    }
  });
};

// Microservices Proxy Routing Rules
app.use('/api/auth', createProxy(config.services.authUser, '/api/auth'));
app.use('/api/users', createProxy(config.services.authUser, '/api/users'));
app.use('/api/chat', createProxy(config.services.chat, '/api/chat'));
app.use('/api/calls', createProxy(config.services.video, '/api/calls'));
app.use('/api/notifications', createProxy(config.services.notification, '/api/notifications'));

// Enhanced Gateway Health Check Route
app.get('/health', async (req, res) => {
  const downstreamStatus = {};

  const checkService = async (name, url) => {
    try {
      const response = await fetch(`${url}/health`, { signal: AbortSignal.timeout(2000) });
      downstreamStatus[name] = response.ok ? 'up' : 'degraded';
    } catch (err) {
      downstreamStatus[name] = 'down';
    }
  };

  await Promise.allSettled([
    checkService('auth-user-service', config.services.authUser),
    checkService('chat-service', config.services.chat),
    checkService('video-call-service', config.services.video),
    checkService('notification-service', config.services.notification)
  ]);

  sendSuccess(res, {
    service: config.serviceName,
    status: 'healthy',
    uptime: process.uptime(),
    services: downstreamStatus
  }, 'API Gateway health status');
});

// Global Error Handler
app.use(errorHandler(logger));

app.listen(config.port, () => {
  logger.info(`🚀 API Gateway running on port ${config.port} in ${config.nodeEnv} mode`);
});
