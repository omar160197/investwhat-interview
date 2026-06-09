import axios from 'axios';
import { env } from '../../config/env.js';
import { ApiError } from '../../utils/ApiError.js';
import Article from '../articles/articles.model.js';
import Summary from './summaries.model.js';

const AI_MODEL = 'openai/gpt-4o-mini';

const buildPrompt = (title, fullText) => `
You are acting in two expert roles simultaneously:
1. A financial news simplifier for beginners
2. An expert quantitative trader and analyst

Article title: ${title}
Article text: ${fullText}

Respond with a JSON object in this EXACT format (no markdown, no code blocks, just raw JSON):
{
  "summary": "A 2-3 sentence plain-language explanation a non-investor would understand",
  "keyPoints": ["Point 1", "Point 2", "Point 3", "Point 4"],
  "tradeAdvice": {
    "action": "BUY",
    "reasoning": "2-3 sentences explaining the trading thesis and why this news matters for investors",
    "risk": "MEDIUM",
    "timeframe": "Short-term (2-4 weeks)",
    "affectedStocks": [
      {
        "symbol": "TICKER",
        "name": "Company Name",
        "action": "BUY",
        "reason": "One sentence explaining why this stock is directly impacted"
      }
    ]
  }
}

Rules for summary section:
- No jargon. Explain any financial term you use. Friendly, encouraging tone.
- Key points: short, punchy, actionable insights. Maximum 4.

Rules for tradeAdvice section:
- action must be one of: BUY, SELL, HOLD, WATCH
- risk must be one of: LOW, MEDIUM, HIGH
- timeframe: realistic horizon (e.g. "Short-term (1-4 weeks)", "Medium-term (1-3 months)", "Long-term (6-12 months)")
- affectedStocks: maximum 3 real publicly-traded companies that are clearly impacted by this news
- Each stock action must be one of: BUY, SELL, HOLD
- Be specific, actionable, and explain your reasoning clearly
`;

const callAI = async (title, fullText) => {
  const response = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      model: AI_MODEL,
      messages: [{ role: 'user', content: buildPrompt(title, fullText) }],
      response_format: { type: 'json_object' },
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
  return JSON.parse(raw);
};

export const summarize = async (articleId) => {
  const existing = await Summary.findOne({ article: articleId }).populate('article', 'title source date');
  if (existing) return existing;

  const article = await Article.findById(articleId);
  if (!article) throw new ApiError(404, 'Article not found');

  const text = article.fullText || article.preview;
  if (!text) throw new ApiError(400, 'Article has no text to summarize');

  const { summary, keyPoints, tradeAdvice } = await callAI(article.title, text);

  const result = await Summary.create({
    article: articleId,
    summary,
    keyPoints,
    tradeAdvice,
    aiModel: AI_MODEL,
  });

  await Article.findByIdAndUpdate(articleId, { isSummarized: true });

  return result.populate('article', 'title source date');
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const bulkSummarize = async (articleIds) => {
  const results = [];
  for (const id of articleIds) {
    try {
      const s = await summarize(id);
      results.push({ id, status: 'success', data: s });
      if (results.length < articleIds.length) await sleep(500);
    } catch (err) {
      const is429 = err.response?.status === 429 || err.message?.includes('429') || err.message?.includes('Too Many Requests');
      results.push({ id, status: is429 ? 'rate_limited' : 'error', message: err.message });
      if (is429) break;
    }
  }
  return results;
};

export const getByArticle = async (articleId) => {
  const summary = await Summary.findOne({ article: articleId }).populate(
    'article',
    'title source date readTime'
  );
  if (!summary) throw new ApiError(404, 'Summary not found');
  return summary;
};
