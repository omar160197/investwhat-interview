import nodemailer from 'nodemailer';
import { env } from '../../config/env.js';
import { ApiError } from '../../utils/ApiError.js';
import Article from '../articles/articles.model.js';
import Summary from '../summaries/summaries.model.js';
import User from '../users/users.model.js';
import Dispatch from './dispatch.model.js';

const transporter = nodemailer.createTransport({
  host:   env.smtp.host,
  port:   env.smtp.port,
  secure: env.smtp.port === 465,
  auth:   { user: env.smtp.user, pass: env.smtp.pass },
});

const buildEmailHtml = (articles) => {
  const articleBlocks = articles
    .map(({ article, summary }) => `
      <div style="margin-bottom:32px;padding-bottom:32px;border-bottom:1px solid #e2e8f0;">
        <p style="font-size:11px;color:#3b7dd8;font-weight:600;margin:0 0 8px;text-transform:uppercase;">
          ${article.source} &middot; ${article.date}
        </p>
        <h2 style="font-family:'Georgia',serif;font-size:20px;color:#1a202c;margin:0 0 12px;line-height:1.3;">
          ${article.title}
        </h2>
        <p style="color:#4a5568;font-size:15px;line-height:1.7;margin:0 0 16px;">
          ${summary.summary}
        </p>
        <div style="background:#f7fafc;border-radius:8px;padding:16px;">
          <p style="font-size:11px;font-weight:600;color:#718096;margin:0 0 10px;letter-spacing:0.04em;">
            KEY TAKEAWAYS
          </p>
          <ul style="margin:0;padding-left:18px;color:#4a5568;font-size:14px;line-height:1.8;">
            ${summary.keyPoints.map((p) => `<li>${p}</li>`).join('')}
          </ul>
        </div>
      </div>
    `)
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
    <body style="margin:0;padding:0;background:#f8f9fb;font-family:'Plus Jakarta Sans',system-ui,sans-serif;">
      <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
        <div style="background:#3b7dd8;padding:28px 32px;">
          <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700;">
            Your Invest Interview Digest
          </h1>
          <p style="color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:14px;">
            Simplified news for smarter investing
          </p>
        </div>
        <div style="padding:32px;">
          ${articleBlocks}
        </div>
        <div style="padding:24px 32px;background:#f8f9fb;border-top:1px solid #e2e8f0;text-align:center;">
          <p style="color:#a0aec0;font-size:12px;margin:0;">
            You received this because you're subscribed to Invest Interview.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const send = async ({ articleIds, audience, recipientIds, sentBy }) => {
  const dispatch = await Dispatch.create({
    articles:   articleIds,
    method:     'email',
    audience,
    recipients: recipientIds || [],
    sentBy,
    status:     'pending',
  });

  try {
    // Fetch articles + their summaries
    const articles = await Article.find({ _id: { $in: articleIds } });
    const summaries = await Summary.find({ article: { $in: articleIds } });
    const summaryMap = Object.fromEntries(summaries.map((s) => [s.article.toString(), s]));

    const enriched = articles.map((a) => ({
      article: a,
      summary: summaryMap[a._id.toString()],
    })).filter((e) => e.summary);

    if (!enriched.length) throw new ApiError(400, 'No summaries found for selected articles');

    // Resolve recipients
    let users = [];
    if (audience === 'all') {
      users = await User.find({ isActive: true }).select('email name');
    } else {
      users = await User.find({ _id: { $in: recipientIds }, isActive: true }).select('email name');
    }

    if (!users.length) throw new ApiError(400, 'No valid recipients found');

    const html = buildEmailHtml(enriched);
    const subject = `Your Invest Interview Digest — ${enriched.length} article${enriched.length !== 1 ? 's' : ''}`;

    await Promise.all(
      users.map((user) =>
        transporter.sendMail({
          from:    env.smtp.from,
          to:      user.email,
          subject,
          html,
        })
      )
    );

    await Dispatch.findByIdAndUpdate(dispatch._id, {
      status: 'sent',
      sentAt: new Date(),
    });

    return Dispatch.findById(dispatch._id)
      .populate('articles', 'title source')
      .populate('recipients', 'name email')
      .populate('sentBy', 'name email');
  } catch (err) {
    await Dispatch.findByIdAndUpdate(dispatch._id, {
      status: 'failed',
      errorMessage: err.message,
    });
    throw err;
  }
};

export const getHistory = async ({ page = 1, limit = 20 }) => {
  const [records, total] = await Promise.all([
    Dispatch.find()
      .populate('articles', 'title source')
      .populate('sentBy', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit)),
    Dispatch.countDocuments(),
  ]);

  return { records, total, page: Number(page), pages: Math.ceil(total / limit) };
};

export const getById = async (id) => {
  const record = await Dispatch.findById(id)
    .populate('articles', 'title source date')
    .populate('recipients', 'name email avatar')
    .populate('sentBy', 'name email');
  if (!record) throw new ApiError(404, 'Dispatch record not found');
  return record;
};
