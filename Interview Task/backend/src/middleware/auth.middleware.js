import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { catchAsync } from '../utils/catchAsync.js';
import User from '../modules/users/users.model.js';

export const protect = catchAsync(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw new ApiError(401, 'No token provided');
  }

  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, env.jwt.accessSecret);

  const user = await User.findById(decoded.id).select('-password -refreshToken');
  if (!user) throw new ApiError(401, 'User no longer exists');

  req.user = user;
  next();
});

export const restrict = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    throw new ApiError(403, 'You do not have permission to perform this action');
  }
  next();
};
