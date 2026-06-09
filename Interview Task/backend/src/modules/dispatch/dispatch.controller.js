import { catchAsync } from '../../utils/catchAsync.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import * as dispatchService from './dispatch.service.js';

export const send = catchAsync(async (req, res) => {
  const { articleIds, audience, recipientIds } = req.body;
  const record = await dispatchService.send({
    articleIds,
    audience,
    recipientIds,
    sentBy: req.user._id,
  });
  ApiResponse(res, 201, 'Articles sent successfully', record);
});

export const getHistory = catchAsync(async (req, res) => {
  const result = await dispatchService.getHistory(req.query);
  ApiResponse(res, 200, 'Dispatch history fetched', result);
});

export const getById = catchAsync(async (req, res) => {
  const record = await dispatchService.getById(req.params.id);
  ApiResponse(res, 200, 'Dispatch record fetched', record);
});
