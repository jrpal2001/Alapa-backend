import { User } from '../models/User.js';
import { sendSuccess, BadRequestError, NotFoundError } from '@alapa/shared';

export const getProfile = async (req, res, next) => {
  try {
    return sendSuccess(res, { user: req.user.toJSON() }, 'Profile retrieved');
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, profileImage } = req.body;
    const user = req.user;

    if (name !== undefined) user.name = name;
    if (profileImage !== undefined) user.profileImage = profileImage;

    await user.save();

    return sendSuccess(res, { user: user.toJSON() }, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user || !user.isActive) {
      throw new NotFoundError('User not found');
    }

    return sendSuccess(res, { user: user.toJSON() }, 'User details retrieved');
  } catch (error) {
    next(error);
  }
};

export const searchUsers = async (req, res, next) => {
  try {
    const { query = '', page = 1, limit = 10 } = req.query;
    const currentUserId = req.user._id;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(50, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const filter = {
      _id: { $ne: currentUserId },
      isActive: true,
      ...(query && {
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } }
        ]
      })
    };

    const [users, total] = await Promise.all([
      User.find(filter).skip(skip).limit(limitNum).sort({ name: 1 }),
      User.countDocuments(filter)
    ]);

    const meta = {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum)
    };

    return sendSuccess(
      res,
      users.map((u) => u.toJSON()),
      'Users retrieved',
      200,
      meta
    );
  } catch (error) {
    next(error);
  }
};

export const addFcmToken = async (req, res, next) => {
  try {
    const { fcmToken } = req.body;

    if (!fcmToken) {
      throw new BadRequestError('FCM token is required');
    }

    const user = req.user;
    if (!user.fcmTokens.includes(fcmToken)) {
      user.fcmTokens.push(fcmToken);
      await user.save();
    }

    return sendSuccess(res, { fcmTokens: user.fcmTokens }, 'FCM token added');
  } catch (error) {
    next(error);
  }
};

export const removeFcmToken = async (req, res, next) => {
  try {
    const { fcmToken } = req.body;

    if (!fcmToken) {
      throw new BadRequestError('FCM token is required');
    }

    const user = req.user;
    user.fcmTokens = user.fcmTokens.filter((token) => token !== fcmToken);
    await user.save();

    return sendSuccess(res, { fcmTokens: user.fcmTokens }, 'FCM token removed');
  } catch (error) {
    next(error);
  }
};

export const blockUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id.toString();

    if (userId === currentUserId) {
      throw new BadRequestError('You cannot block yourself');
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      throw new NotFoundError('User to block does not exist');
    }

    const user = req.user;
    if (!user.blockedUsers.includes(userId)) {
      user.blockedUsers.push(userId);
      await user.save();
    }

    return sendSuccess(res, { blockedUsers: user.blockedUsers }, 'User blocked successfully');
  } catch (error) {
    next(error);
  }
};

export const unblockUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = req.user;

    user.blockedUsers = user.blockedUsers.filter((id) => id.toString() !== userId);
    await user.save();

    return sendSuccess(res, { blockedUsers: user.blockedUsers }, 'User unblocked successfully');
  } catch (error) {
    next(error);
  }
};
