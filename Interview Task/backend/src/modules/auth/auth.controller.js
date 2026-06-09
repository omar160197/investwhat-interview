import { catchAsync } from '../../utils/catchAsync.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import * as authService from './auth.service.js';

export const register = catchAsync(async (req, res) => {
  const result = await authService.register(req.body);
  ApiResponse(res, 201, 'Registered successfully', result);
});

export const login = catchAsync(async (req, res) => {
  const result = await authService.login(req.body);
  ApiResponse(res, 200, 'Logged in successfully', result);
});

export const refresh = catchAsync(async (req, res) => {
  const token = req.body.refreshToken || req.cookies?.refreshToken;
  const tokens = await authService.refresh(token);
  ApiResponse(res, 200, 'Token refreshed', tokens);
});

export const logout = catchAsync(async (req, res) => {
  await authService.logout(req.user._id);
  ApiResponse(res, 200, 'Logged out successfully');
});

export const me = catchAsync(async (req, res) => {
  ApiResponse(res, 200, 'Current user', req.user);
});
