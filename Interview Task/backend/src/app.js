import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { env } from './config/env.js';
import { errorMiddleware } from './middleware/error.middleware.js';

import authRouter     from './modules/auth/auth.router.js';
import usersRouter    from './modules/users/users.router.js';
import topicsRouter   from './modules/topics/topics.router.js';
import articlesRouter from './modules/articles/articles.router.js';
import summariesRouter from './modules/summaries/summaries.router.js';
import dispatchRouter from './modules/dispatch/dispatch.router.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(morgan(env.nodeEnv === 'development' ? 'dev' : 'combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth',      authRouter);
app.use('/api/users',     usersRouter);
app.use('/api/topics',    topicsRouter);
app.use('/api/articles',  articlesRouter);
app.use('/api/summaries', summariesRouter);
app.use('/api/dispatch',  dispatchRouter);

app.use(errorMiddleware);

export default app;
