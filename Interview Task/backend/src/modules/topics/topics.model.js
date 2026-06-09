import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['sector', 'stock', 'theme'],
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: '',
    },
    subtitle: {
      type: String,
      default: '',
    },
    relatedStocks: [{ type: String }],
    relatedThemes: [{ type: String }],
  },
  { timestamps: true }
);

const Topic = mongoose.model('Topic', topicSchema);
export default Topic;
