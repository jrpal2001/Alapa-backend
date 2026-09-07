import { HTTP_STATUS } from '../constants/index.js';

export const sendSuccess = (res, data = null, message = 'Success', statusCode = HTTP_STATUS.OK, meta = null) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    ...(meta && { meta })
  });
};

export const sendError = (res, message = 'Internal Server Error', statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, details = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(details && { details })
  });
};
