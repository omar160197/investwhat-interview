import { catchAsync } from '../../utils/catchAsync.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import * as topicsService from './topics.service.js';

export const getAll = catchAsync(async (req, res) => {
  const data = await topicsService.getAll();
  ApiResponse(res, 200, 'Topics fetched', data);
});

export const getByType = catchAsync(async (req, res) => {
  const data = await topicsService.getByType(req.params.type);
  ApiResponse(res, 200, `${req.params.type}s fetched`, data);
});

export const getRelatedStocks = catchAsync(async (req, res) => {
  const data = await topicsService.getRelatedStocks(req.params.slug);
  ApiResponse(res, 200, 'Related stocks fetched', data);
});

export const getRelatedThemes = catchAsync(async (req, res) => {
  const data = await topicsService.getRelatedThemes(req.params.slug);
  ApiResponse(res, 200, 'Related themes fetched', data);
});

export const suggestStocks = catchAsync(async (req, res) => {
  const { topicIds } = req.body;
  const data = await topicsService.suggestStocks(topicIds);
  ApiResponse(res, 200, 'AI suggestions ready', data);
});
