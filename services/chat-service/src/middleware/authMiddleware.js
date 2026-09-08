import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '@alapa/shared';

export const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authentication token required');
    }

    const token = authHeader.split(' ')[1];
    const jwtSecret = process.env.JWT_SECRET || 'supersecretjwtkey_change_in_production';
    const decoded = jwt.verify(token, jwtSecret);

    req.user = {
      _id: decoded.userId,
      email: decoded.email,
      name: decoded.name
    };

    next();
  } catch (error) {
    next(new UnauthorizedError('Invalid or expired authentication token'));
  }
};
