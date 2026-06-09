import { catchAsync } from '../../utils/catchAsync.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import * as usersService from './users.service.js';

export const getAll = catchAsync(async (req, res) => {
  const result = await usersService.getAll(req.query);
  ApiResponse(res, 200, 'Users fetched', result);
});

export const getById = catchAsync(async (req, res) => {
  const user = await usersService.getById(req.params.id);
  ApiResponse(res, 200, 'User fetched', user);
});

export const updateProfile = catchAsync(async (req, res) => {
  const user = await usersService.updateProfile(req.params.id, req.body);
  ApiResponse(res, 200, 'Profile updated', user);
});

export const updatePreferences = catchAsync(async (req, res) => {
  const user = await usersService.updatePreferences(req.params.id, req.body.topics);
  ApiResponse(res, 200, 'Preferences updated', user);
});

export const deleteUser = catchAsync(async (req, res) => {
  await usersService.softDelete(req.params.id);
  ApiResponse(res, 200, 'User deleted');
});
