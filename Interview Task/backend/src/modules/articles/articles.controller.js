import { catchAsync } from '../../utils/catchAsync.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import * as articlesService from './articles.service.js';

export const search = catchAsync(async (req, res) => {
  const { topicIds } = req.body;
  const articles = await articlesService.searchAndImport(topicIds);
  ApiResponse(res, 200, 'Articles imported', articles);
});

export const getAll = catchAsync(async (req, res) => {
  const result = await articlesService.getAll(req.query);
  ApiResponse(res, 200, 'Articles fetched', result);
});

export const getById = catchAsync(async (req, res) => {
  const article = await articlesService.getById(req.params.id);
  ApiResponse(res, 200, 'Article fetched', article);
});

export const fetchContent = catchAsync(async (req, res) => {
  const article = await articlesService.fetchContent(req.params.id);
  ApiResponse(res, 200, 'Article content fetched', article);
});
