import { Router } from 'express';
import { z } from 'zod';
import { protect } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import * as summariesController from './summaries.controller.js';

const router = Router();

const summarizeSchema = z.object({
  articleId: z.string().min(1, 'articleId is required'),
});

const bulkSchema = z.object({
  articleIds: z.array(z.string()).min(1, 'At least one articleId required'),
});

router.use(protect);

router.post('/',       validate(summarizeSchema), summariesController.summarize);
router.post('/bulk',   validate(bulkSchema),      summariesController.bulkSummarize);
router.get('/:articleId',                         summariesController.getByArticle);

export default router;
