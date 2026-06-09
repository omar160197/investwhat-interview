import mongoose from 'mongoose';

const summarySchema = new mongoose.Schema(
  {
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Article',
      required: true,
      unique: true,
    },
    summary: {
      type: String,
      required: true,
    },
    keyPoints: {
      type: [String],
      default: [],
    },
    tradeAdvice: {
      action:   String,
      reasoning: String,
      risk:     String,
      timeframe: String,
      affectedStocks: [{
        symbol: String,
        name:   String,
        action: String,
        reason: String,
        _id: false,
      }],
    },
    aiModel: {
      type: String,
      default: 'claude-sonnet-4-6',
    },
  },
  { timestamps: true }
);

const Summary = mongoose.model('Summary', summarySchema);
export default Summary;
