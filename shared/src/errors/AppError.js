import { HTTP_STATUS } from '../constants/index.js';

export class AppError extends Error {
  constructor(message, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, details = null) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = true;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad Request', details = null) {
    super(message, HTTP_STATUS.BAD_REQUEST, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized', details = null) {
    super(message, HTTP_STATUS.UNAUTHORIZED, details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden', details = null) {
    super(message, HTTP_STATUS.FORBIDDEN, details);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource Not Found', details = null) {
    super(message, HTTP_STATUS.NOT_FOUND, details);
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'Internal Server Error', details = null) {
    super(message, HTTP_STATUS.INTERNAL_SERVER_ERROR, details);
  }
}
