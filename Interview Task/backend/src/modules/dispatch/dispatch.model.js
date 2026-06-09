import mongoose from 'mongoose';

const dispatchSchema = new mongoose.Schema(
  {
    articles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }],
    method: {
      type: String,
      enum: ['email'],
      default: 'email',
    },
    audience: {
      type: String,
      enum: ['all', 'specific'],
      required: true,
    },
    recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'sent', 'failed'],
      default: 'pending',
    },
    errorMessage: {
      type: String,
      default: '',
    },
    sentAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Dispatch = mongoose.model('Dispatch', dispatchSchema);
export default Dispatch;
