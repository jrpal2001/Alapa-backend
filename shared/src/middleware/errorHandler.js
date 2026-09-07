import { AppError } from '../errors/AppError.js';
import { sendError } from '../utils/responseHandler.js';
import { HTTP_STATUS } from '../constants/index.js';

export const errorHandler = (logger) => (err, req, res, next) => {
  if (err instanceof AppError) {
    if (logger) {
      logger.warn(`Operational Error: ${err.message}`, { statusCode: err.statusCode, details: err.details });
    }
    return sendError(res, err.message, err.statusCode, err.details);
  }

  if (logger) {
    logger.error(`Unhandled Error: ${err.message}`, { stack: err.stack });
  }

  return sendError(res, 'Internal Server Error', HTTP_STATUS.INTERNAL_SERVER_ERROR);
};
