import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { ApiError } from '../../utils/ApiError.js';
import User from './auth.model.js';

const signAccessToken = (id) =>
  jwt.sign({ id }, env.jwt.accessSecret, { expiresIn: env.jwt.accessExpires });

const signRefreshToken = (id) =>
  jwt.sign({ id }, env.jwt.refreshSecret, { expiresIn: env.jwt.refreshExpires });

const issueTokens = (id) => ({
  accessToken:  signAccessToken(id),
  refreshToken: signRefreshToken(id),
});

export const register = async ({ name, email, password, role }) => {
  const exists = await User.findOne({ email });
  if (exists) throw new ApiError(409, 'Email already in use');

  const avatar = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');

  const user = await User.create({ name, email, password, role, avatar });
  const tokens = issueTokens(user._id);

  await User.findByIdAndUpdate(user._id, { refreshToken: tokens.refreshToken });

  return { user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar }, ...tokens };
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }
  if (!user.isActive) throw new ApiError(403, 'Account deactivated');

  const tokens = issueTokens(user._id);
  await User.findByIdAndUpdate(user._id, { refreshToken: tokens.refreshToken });

  return { user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar }, ...tokens };
};

export const refresh = async (token) => {
  if (!token) throw new ApiError(401, 'No refresh token');

  let decoded;
  try {
    decoded = jwt.verify(token, env.jwt.refreshSecret);
  } catch {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }

  const user = await User.findById(decoded.id).select('+refreshToken');
  if (!user || user.refreshToken !== token) {
    throw new ApiError(401, 'Refresh token reuse detected');
  }

  const tokens = issueTokens(user._id);
  await User.findByIdAndUpdate(user._id, { refreshToken: tokens.refreshToken });

  return tokens;
};

export const logout = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
};
