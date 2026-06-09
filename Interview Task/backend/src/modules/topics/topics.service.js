import axios from 'axios';
import { env } from '../../config/env.js';
import { ApiError } from '../../utils/ApiError.js';
import Topic from './topics.model.js';

const AI_MODEL = 'openai/gpt-4o-mini';

const SEED_DATA = [
  // Sectors
  { slug: 'tech',        type: 'sector', label: 'Technology',     icon: 'Cpu',         relatedStocks: ['aapl','msft','googl','nvda','meta','amzn'] },
  { slug: 'energy',      type: 'sector', label: 'Energy',         icon: 'Zap',         relatedStocks: [] },
  { slug: 'healthcare',  type: 'sector', label: 'Healthcare',     icon: 'HeartPulse',  relatedStocks: [] },
  { slug: 'finance',     type: 'sector', label: 'Finance',        icon: 'DollarSign',  relatedStocks: [] },
  { slug: 'consumer',    type: 'sector', label: 'Consumer goods', icon: 'ShoppingBag', relatedStocks: ['aapl','amzn','nflx','tsla'] },
  { slug: 'realestate',  type: 'sector', label: 'Real estate',    icon: 'Building',    relatedStocks: [] },
  // Stocks
  { slug: 'aapl',  type: 'stock', label: 'AAPL',  subtitle: 'Apple',     relatedThemes: ['ai'] },
  { slug: 'tsla',  type: 'stock', label: 'TSLA',  subtitle: 'Tesla',     relatedThemes: ['ev','green'] },
  { slug: 'msft',  type: 'stock', label: 'MSFT',  subtitle: 'Microsoft', relatedThemes: ['ai'] },
  { slug: 'googl', type: 'stock', label: 'GOOGL', subtitle: 'Alphabet',  relatedThemes: ['ai'] },
  { slug: 'amzn',  type: 'stock', label: 'AMZN',  subtitle: 'Amazon',    relatedThemes: ['ai'] },
  { slug: 'nvda',  type: 'stock', label: 'NVDA',  subtitle: 'Nvidia',    relatedThemes: ['ai'] },
  { slug: 'meta',  type: 'stock', label: 'META',  subtitle: 'Meta',      relatedThemes: ['ai'] },
  { slug: 'nflx',  type: 'stock', label: 'NFLX',  subtitle: 'Netflix',   relatedThemes: [] },
  // Themes
  { slug: 'ai',     type: 'theme', label: 'Artificial intelligence', icon: 'Brain' },
  { slug: 'green',  type: 'theme', label: 'Green energy',            icon: 'Leaf' },
  { slug: 'crypto', type: 'theme', label: 'Cryptocurrency',          icon: 'Bitcoin' },
  { slug: 'ev',     type: 'theme', label: 'Electric vehicles',       icon: 'Car' },
  { slug: 'space',  type: 'theme', label: 'Space technology',        icon: 'Rocket' },
  { slug: 'biotech',type: 'theme', label: 'Biotechnology',           icon: 'HeartPulse' },
];

export const seed = async () => {
  const count = await Topic.countDocuments();
  if (count > 0) return;
  await Topic.insertMany(SEED_DATA);
  console.log('Topics seeded');
};

export const getAll = async () => {
  const topics = await Topic.find().sort({ type: 1, label: 1 });
  return {
    sectors: topics.filter((t) => t.type === 'sector'),
    stocks:  topics.filter((t) => t.type === 'stock'),
    themes:  topics.filter((t) => t.type === 'theme'),
  };
};

export const getByType = async (type) => {
  return Topic.find({ type }).sort({ label: 1 });
};

export const getRelatedStocks = async (sectorSlug) => {
  const sector = await Topic.findOne({ slug: sectorSlug, type: 'sector' });
  if (!sector) throw new ApiError(404, 'Sector not found');
  return Topic.find({ slug: { $in: sector.relatedStocks }, type: 'stock' });
};

export const getRelatedThemes = async (stockSlug) => {
  const stock = await Topic.findOne({ slug: stockSlug, type: 'stock' });
  if (!stock) throw new ApiError(404, 'Stock not found');
  return Topic.find({ slug: { $in: stock.relatedThemes }, type: 'theme' });
};

export const suggestStocks = async (topicIds) => {
  if (!topicIds?.length) throw new ApiError(400, 'No topics provided');

  const selected = await Topic.find({ _id: { $in: topicIds } }).select('label type slug');
  const allStocks = await Topic.find({ type: 'stock' }).select('_id slug label subtitle');

  const selectedLabels = selected.map((t) => `${t.label} (${t.type})`).join(', ');
  const stockList = allStocks.map((s) => `${s.slug}: ${s.label} - ${s.subtitle}`).join('\n');

  const prompt = `You are a financial advisor assistant. A user is interested in: ${selectedLabels}.

From this list of available stocks, suggest the 3 most relevant ones to watch and briefly explain why (1 sentence each):
${stockList}

Respond ONLY with a raw JSON array, no markdown, no code blocks:
[
  { "slug": "stock_slug", "reason": "Why this stock is relevant" },
  { "slug": "stock_slug", "reason": "Why this stock is relevant" },
  { "slug": "stock_slug", "reason": "Why this stock is relevant" }
]`;

  const response = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      model: AI_MODEL,
      messages: [{ role: 'user', content: prompt }],
    },
    {
      headers: {
        Authorization: `Bearer ${env.openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': env.clientUrl,
        'X-Title': 'Invest Interview',
      },
    }
  );
  const raw = response.data.choices[0].message.content.trim()
    .replace(/^```json\s*/i, '').replace(/```$/m, '');
  const suggestions = JSON.parse(raw);

  return suggestions
    .map((s) => {
      const stock = allStocks.find((st) => st.slug === s.slug);
      if (!stock) return null;
      return { _id: stock._id, slug: stock.slug, label: stock.label, subtitle: stock.subtitle, reason: s.reason };
    })
    .filter(Boolean);
};
