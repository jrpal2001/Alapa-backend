import mongoose from 'mongoose';

const callSchema = new mongoose.Schema(
  {
    callerId: {
      type: String,
      required: [true, 'Caller ID is required'],
      index: true
    },
    receiverId: {
      type: String,
      required: [true, 'Receiver ID is required'],
      index: true
    },
    type: {
      type: String,
      enum: ['audio', 'video'],
      default: 'video'
    },
    status: {
      type: String,
      enum: ['ringing', 'accepted', 'rejected', 'missed', 'cancelled', 'ended'],
      default: 'ringing',
      index: true
    },
    startedAt: {
      type: Date,
      default: Date.now
    },
    answeredAt: {
      type: Date,
      default: null
    },
    endedAt: {
      type: Date,
      default: null
    },
    endedBy: {
      type: String,
      default: ''
    },
    duration: {
      type: Number,
      default: 0 // Duration in seconds
    }
  },
  {
    timestamps: true
  }
);

callSchema.index({ callerId: 1, createdAt: -1 });
callSchema.index({ receiverId: 1, createdAt: -1 });

export const Call = mongoose.model('Call', callSchema);
