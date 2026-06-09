import RSSParser from 'rss-parser';
import * as cheerio from 'cheerio';
import axios from 'axios';
import { ApiError } from '../../utils/ApiError.js';
import Article from './articles.model.js';
import Topic from '../topics/topics.model.js';

const parser = new RSSParser();

const BBC_FEEDS = {
  tech:       'http://feeds.bbci.co.uk/news/technology/rss.xml',
  energy:     'http://feeds.bbci.co.uk/news/science_and_environment/rss.xml',
  healthcare: 'http://feeds.bbci.co.uk/news/health/rss.xml',
  finance:    'http://feeds.bbci.co.uk/news/business/rss.xml',
  consumer:   'http://feeds.bbci.co.uk/news/business/rss.xml',
  realestate: 'http://feeds.bbci.co.uk/news/business/rss.xml',
  ai:         'http://feeds.bbci.co.uk/news/technology/rss.xml',
  ev:         'http://feeds.bbci.co.uk/news/science_and_environment/rss.xml',
  green:      'http://feeds.bbci.co.uk/news/science_and_environment/rss.xml',
  crypto:     'http://feeds.bbci.co.uk/news/technology/rss.xml',
  space:      'http://feeds.bbci.co.uk/news/science_and_environment/rss.xml',
  biotech:    'http://feeds.bbci.co.uk/news/health/rss.xml',
};

// Keywords used to check whether an article is relevant to a topic
const TOPIC_KEYWORDS = {
  tech:       ['tech', 'technology', 'software', 'hardware', 'digital', 'cyber', 'computing', 'app', 'internet', 'startup', 'chip', 'semiconductor', 'data'],
  energy:     ['energy', 'oil', 'gas', 'power', 'electricity', 'fuel', 'petroleum', 'coal', 'nuclear', 'solar', 'wind', 'renewable', 'opec'],
  healthcare: ['health', 'medical', 'medicine', 'hospital', 'drug', 'patient', 'disease', 'treatment', 'pharma', 'nhs', 'clinical', 'vaccine', 'cancer', 'therapy'],
  finance:    ['bank', 'banking', 'finance', 'financial', 'economy', 'economic', 'stock market', 'interest rate', 'inflation', 'gdp', 'federal reserve', 'central bank', 'debt', 'budget', 'tax', 'revenue', 'profit', 'earnings', 'shares', 'investor', 'investment', 'wall street', 'market'],
  consumer:   ['consumer', 'retail', 'shopping', 'brand', 'product', 'sales', 'store', 'customer', 'spend', 'luxury', 'fashion', 'food', 'drink', 'restaurant', 'supermarket', 'goods'],
  realestate: ['property', 'real estate', 'housing', 'house prices', 'rent', 'mortgage', 'landlord', 'tenant', 'construction', 'office space', 'homeowner'],
  ai:         ['artificial intelligence', ' ai ', 'machine learning', 'deep learning', 'neural network', 'chatgpt', 'openai', 'llm', 'generative ai', 'automation', 'large language'],
  ev:         ['electric vehicle', 'electric car', 'ev ', 'tesla', 'battery', 'charging', 'hybrid', 'byd', 'rivian', 'lucid motors'],
  green:      ['green', 'climate change', 'carbon', 'sustainability', 'emission', 'net zero', 'renewable', 'esg', 'environment', 'global warming'],
  crypto:     ['crypto', 'bitcoin', 'ethereum', 'blockchain', 'nft', 'defi', 'token', 'coinbase', 'binance', 'web3', 'stablecoin'],
  space:      ['space', 'nasa', 'rocket', 'satellite', 'spacex', 'launch', 'orbit', 'astronaut', 'mars', 'moon', 'spacecraft'],
  biotech:    ['biotech', 'gene', 'dna', 'rna', 'clinical trial', 'pharmaceutical', 'biopharma', 'cell therapy', 'genomics', 'biologic'],
  // Stocks — named-entity matching
  aapl:  ['apple', 'iphone', 'macbook', 'app store', 'tim cook', 'airpods', 'apple watch'],
  tsla:  ['tesla', 'elon musk', 'cybertruck', 'model 3', 'model y', 'model s', 'supercharger', 'tesla stock'],
  msft:  ['microsoft', 'windows', 'azure', 'office 365', 'xbox', 'satya nadella', 'teams', 'linkedin'],
  googl: ['google', 'alphabet', 'search engine', 'youtube', 'android', 'sundar pichai', 'chrome'],
  amzn:  ['amazon', 'aws', 'prime', 'alexa', 'jeff bezos', 'andy jassy', 'whole foods'],
  nvda:  ['nvidia', 'gpu', 'graphics card', 'jensen huang', 'ai chip', 'cuda', 'geforce'],
  meta:  ['facebook', 'instagram', 'whatsapp', 'mark zuckerberg', 'threads', 'meta platforms', 'metaverse'],
  nflx:  ['netflix', 'streaming service', 'subscriber', 'reed hastings', 'netflix original'],
};

const matchesTopics = (title = '', snippet = '', topicSlugs) => {
  const text = `${title} ${snippet}`.toLowerCase();
  return topicSlugs.filter((slug) => {
    const keywords = TOPIC_KEYWORDS[slug] || [slug];
    return keywords.some((kw) => text.includes(kw.toLowerCase()));
  });
};

const estimateReadTime = (text = '') => {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
};

const BBC_SELECTORS = [
  '[data-component="text-block"] p',
  'article[class*="article"] p',
  '.ssrcss-11r1m41-RichTextComponentWrapper p',
  '[class*="RichTextComponentWrapper"] p',
  '[class*="ArticleBody"] p',
  '.article__body p',
  '.story-body__inner p',
  'article p',
  'main p',
];

const scrapeFullText = async (url) => {
  try {
    const { data } = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
    });
    const $ = cheerio.load(data);
    $('script, style, nav, header, footer, aside, [class*="advert"], [class*="cookie"]').remove();

    for (const selector of BBC_SELECTORS) {
      const paragraphs = $(selector)
        .map((_, el) => $(el).text().trim())
        .get()
        .filter((t) => t.length > 40);
      if (paragraphs.length > 0) return paragraphs.join('\n\n');
    }
    return '';
  } catch {
    return '';
  }
};

export const searchAndImport = async (topicIds) => {
  if (!topicIds?.length) throw new ApiError(400, 'At least one topic is required');

  // Resolve MongoDB IDs → slugs so we can map to BBC feeds
  const topicDocs = await Topic.find({ _id: { $in: topicIds } }).select('slug');
  const topicSlugs = topicDocs.map((t) => t.slug);

  const feedUrls = [...new Set(topicSlugs.map((s) => BBC_FEEDS[s]).filter(Boolean))];
  if (!feedUrls.length) throw new ApiError(400, 'No BBC feeds mapped for given topics');

  const allItems = [];

  await Promise.allSettled(
    feedUrls.map(async (feedUrl) => {
      const feed = await parser.parseURL(feedUrl);
      allItems.push(...(feed.items || []));
    })
  );

  if (!allItems.length) return [];

  const VIDEO_PATTERNS = [
    /bbc\.co\.uk\/iplayer/,
    /bbc\.com\/iplayer/,
    /\/video\//,
    /\/videos\//,
    /\/av\//,
    /[?&]at_medium=RSS.*iplayer/i,
  ];

  const isArticleUrl = (url) => url && !VIDEO_PATTERNS.some((re) => re.test(url));

  // Filter out videos/iPlayer, deduplicate by link
  const unique = Object.values(
    allItems.reduce((acc, item) => {
      if (isArticleUrl(item.link) && !acc[item.link]) acc[item.link] = item;
      return acc;
    }, {})
  );

  // Keep only articles relevant to the selected topics via keyword matching.
  // Fall back to all unique items only if no matches (avoids empty results).
  const relevant = unique.filter((item) =>
    matchesTopics(item.title, item.contentSnippet || item.summary, topicSlugs).length > 0
  );
  const pool = relevant.length > 0 ? relevant : unique;

  // Skip already-imported URLs
  const existingUrls = new Set(
    (await Article.find({ url: { $in: pool.map((i) => i.link) } }).select('url')).map(
      (a) => a.url
    )
  );

  const newItems = pool.filter((item) => !existingUrls.has(item.link));
  if (!newItems.length) {
    return Article.find({ url: { $in: pool.map((i) => i.link) } });
  }

  // Scrape full text and tag each article only with the topics it actually matches
  const enriched = await Promise.all(
    newItems.map(async (item) => {
      const fullText = await scrapeFullText(item.link);
      const matchedTopics = matchesTopics(
        item.title,
        `${item.contentSnippet || item.summary || ''} ${fullText.slice(0, 500)}`,
        topicSlugs
      );
      return {
        title:    item.title || '',
        source:   'BBC News',
        url:      item.link,
        date:     formatDate(item.pubDate || item.isoDate),
        preview:  item.contentSnippet || item.summary || '',
        fullText,
        readTime: estimateReadTime(fullText || item.contentSnippet),
        topics:   matchedTopics.length > 0 ? matchedTopics : topicSlugs,
        scrapedAt: new Date(),
      };
    })
  );

  await Article.insertMany(enriched, { ordered: false });

  return Article.find({ url: { $in: pool.map((i) => i.link) } });
};

export const getAll = async ({ page = 1, limit = 20, topics = '' }) => {
  const query = {};
  if (topics) query.topics = { $in: topics.split(',') };

  const [articles, total] = await Promise.all([
    Article.find(query)
      .sort({ scrapedAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit)),
    Article.countDocuments(query),
  ]);

  return { articles, total, page: Number(page), pages: Math.ceil(total / limit) };
};

export const getById = async (id) => {
  const article = await Article.findById(id);
  if (!article) throw new ApiError(404, 'Article not found');
  return article;
};

export const fetchContent = async (id) => {
  const article = await Article.findById(id);
  if (!article) throw new ApiError(404, 'Article not found');
  if (article.fullText) return article;

  const fullText = await scrapeFullText(article.url);
  article.fullText = fullText;
  article.readTime = estimateReadTime(fullText || article.preview);
  await article.save();
  return article;
};
