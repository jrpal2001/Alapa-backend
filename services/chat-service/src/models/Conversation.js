import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['one_to_one', 'group'],
      default: 'one_to_one'
    },
    participants: [
      {
        type: String,
        required: true,
        index: true
      }
    ],
    lastMessage: {
      text: { type: String, default: '' },
      senderId: { type: String, default: '' },
      type: { type: String, default: 'text' },
      createdAt: { type: Date, default: Date.now }
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
      index: true
    },
    unreadCounts: {
      type: Map,
      of: Number,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

export const Conversation = mongoose.model('Conversation', conversationSchema);
