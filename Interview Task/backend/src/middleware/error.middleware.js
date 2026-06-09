import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

export const errorMiddleware = (err, req, res, next) => {
  let error = err;

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    error = new ApiError(400, `Invalid ${err.path}: ${err.value}`);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = new ApiError(409, `${field} already exists`);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    error = new ApiError(400, messages.join(', '));
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') error = new ApiError(401, 'Invalid token');
  if (err.name === 'TokenExpiredError')  error = new ApiError(401, 'Token expired');

  // AI provider rate limit (OpenRouter, Gemini, etc.)
  if (err.response?.status === 429 || err.message?.includes('429') || err.message?.includes('Too Many Requests')) {
    const retryAfterHeader = err.response?.headers?.['retry-after'];
    const retryIn = retryAfterHeader ? parseInt(retryAfterHeader) : 60;
    error = new ApiError(429, `AI rate limit reached. Please retry in ${retryIn} seconds.`);
    error.retryAfter = retryIn;
  }

  const statusCode = error.statusCode || 500;
  const message    = error.message    || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(error.retryAfter && { retryAfter: error.retryAfter }),
    ...(env.nodeEnv === 'development' && { stack: err.stack }),
  });
};
