import { verifyAccessToken } from '../utils/jwt.js';
import { User } from '../models/User.js';
import { UnauthorizedError, ForbiddenError } from '@alapa/shared';

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authentication token required');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new UnauthorizedError('User associated with this token no longer exists');
    }

    if (!user.isActive) {
      throw new ForbiddenError('Account is deactivated');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
