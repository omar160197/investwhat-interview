import { catchAsync } from '../../utils/catchAsync.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import * as summariesService from './summaries.service.js';

export const summarize = catchAsync(async (req, res) => {
  const summary = await summariesService.summarize(req.body.articleId);
  ApiResponse(res, 201, 'Summary created', summary);
});

export const bulkSummarize = catchAsync(async (req, res) => {
  const results = await summariesService.bulkSummarize(req.body.articleIds);
  ApiResponse(res, 200, 'Bulk summarize complete', results);
});

export const getByArticle = catchAsync(async (req, res) => {
  const summary = await summariesService.getByArticle(req.params.articleId);
  ApiResponse(res, 200, 'Summary fetched', summary);
});
