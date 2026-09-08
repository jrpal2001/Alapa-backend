import { OAuth2Client } from 'google-auth-library';
import { User } from '../models/User.js';
import { config } from '../config/env.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateTokens, verifyRefreshToken } from '../utils/jwt.js';
import { sendSuccess, BadRequestError, UnauthorizedError, HTTP_STATUS } from '@alapa/shared';

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new BadRequestError('Name, email, and password are required');
    }

    if (password.length < 6) {
      throw new BadRequestError('Password must be at least 6 characters long');
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new BadRequestError('User with this email already exists');
    }

    const passwordHash = await hashPassword(password);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      authProvider: 'email'
    });

    const tokens = generateTokens(user);

    user.refreshTokens.push(tokens.refreshToken);
    await user.save();

    return sendSuccess(
      res,
      {
        user: user.toJSON(),
        tokens
      },
      'User registered successfully',
      HTTP_STATUS.CREATED
    );
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError('Email and password are required');
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash +refreshTokens');
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    if (!user.passwordHash) {
      throw new BadRequestError('Please log in using your OAuth provider (Google/Apple)');
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const tokens = generateTokens(user);

    user.refreshTokens.push(tokens.refreshToken);
    await user.save();

    return sendSuccess(
      res,
      {
        user: user.toJSON(),
        tokens
      },
      'Login successful'
    );
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new BadRequestError('Refresh token is required');
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.userId).select('+refreshTokens');
    
    if (!user || !user.isActive) {
      throw new UnauthorizedError('Invalid user session');
    }

    if (!user.refreshTokens.includes(refreshToken)) {
      throw new UnauthorizedError('Refresh token revoked or reused');
    }

    // Remove consumed refresh token (token rotation)
    user.refreshTokens = user.refreshTokens.filter((token) => token !== refreshToken);

    // Issue new token pair
    const tokens = generateTokens(user);
    user.refreshTokens.push(tokens.refreshToken);
    await user.save();

    return sendSuccess(res, { tokens }, 'Token refreshed successfully');
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      const decoded = verifyRefreshToken(refreshToken).catch(() => null);
      if (decoded) {
        const user = await User.findById(decoded.userId).select('+refreshTokens');
        if (user) {
          user.refreshTokens = user.refreshTokens.filter((token) => token !== refreshToken);
          await user.save();
        }
      }
    }

    return sendSuccess(res, null, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    return sendSuccess(res, { user: req.user.toJSON() }, 'User profile retrieved');
  } catch (error) {
    next(error);
  }
};

export const googleAuth = async (req, res, next) => {
  try {
    let { idToken, googleId, email, name, profileImage } = req.body;

    // Cryptographic Google ID Token verification if idToken is provided by mobile client
    if (idToken) {
      try {
        const client = new OAuth2Client(config.googleClientId);
        const ticket = await client.verifyIdToken({
          idToken,
          audience: config.googleClientId || undefined
        });
        const payload = ticket.getPayload();
        if (payload) {
          googleId = payload.sub;
          email = payload.email;
          name = payload.name || name;
          profileImage = payload.picture || profileImage;
        }
      } catch (verifyErr) {
        throw new BadRequestError(`Invalid Google ID Token: ${verifyErr.message}`);
      }
    }

    if (!googleId || !email) {
      throw new BadRequestError('Google ID or valid idToken and email are required');
    }

    let user = await User.findOne({ $or: [{ googleId }, { email: email.toLowerCase() }] }).select('+refreshTokens');

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
      }
      if (profileImage && !user.profileImage) {
        user.profileImage = profileImage;
      }
    } else {
      user = new User({
        name: name || 'Google User',
        email: email.toLowerCase(),
        authProvider: 'google',
        googleId,
        profileImage: profileImage || ''
      });
    }

    const tokens = generateTokens(user);
    user.refreshTokens.push(tokens.refreshToken);
    await user.save();

    return sendSuccess(res, { user: user.toJSON(), tokens }, 'Google authentication successful');
  } catch (error) {
    next(error);
  }
};

export const appleAuth = async (req, res, next) => {
  try {
    const { appleId, email, name } = req.body;

    if (!appleId || !email) {
      throw new BadRequestError('Apple ID and email are required');
    }

    let user = await User.findOne({ $or: [{ appleId }, { email: email.toLowerCase() }] }).select('+refreshTokens');

    if (user) {
      if (!user.appleId) {
        user.appleId = appleId;
      }
    } else {
      user = new User({
        name: name || 'Apple User',
        email: email.toLowerCase(),
        authProvider: 'apple',
        appleId
      });
    }

    const tokens = generateTokens(user);
    user.refreshTokens.push(tokens.refreshToken);
    await user.save();

    return sendSuccess(res, { user: user.toJSON(), tokens }, 'Apple authentication successful');
  } catch (error) {
    next(error);
  }
};
