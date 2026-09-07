import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    passwordHash: {
      type: String,
      select: false
    },
    authProvider: {
      type: String,
      enum: ['email', 'google', 'apple'],
      default: 'email'
    },
    googleId: {
      type: String,
      default: null,
      sparse: true
    },
    appleId: {
      type: String,
      default: null,
      sparse: true
    },
    profileImage: {
      type: String,
      default: ''
    },
    fcmTokens: {
      type: [String],
      default: []
    },
    blockedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.passwordHash;
  delete user.__v;
  return user;
};

export const User = mongoose.model('User', userSchema);
