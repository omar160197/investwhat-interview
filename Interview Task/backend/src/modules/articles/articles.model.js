import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    source: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
      unique: true,
    },
    date: {
      type: String,
    },
    readTime: {
      type: String,
    },
    preview: {
      type: String,
    },
    fullText: {
      type: String,
    },
    topics: {
      type: [String],
      default: [],
    },
    isSummarized: {
      type: Boolean,
      default: false,
    },
    scrapedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

articleSchema.index({ topics: 1 });

const Article = mongoose.model('Article', articleSchema);
export default Article;
