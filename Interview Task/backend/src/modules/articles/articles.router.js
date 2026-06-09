import { Router } from 'express';
import { z } from 'zod';
import { protect } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import * as articlesController from './articles.controller.js';

const router = Router();

const searchSchema = z.object({
  topicIds: z.array(z.string()).min(1, 'At least one topic is required'),
});

router.post('/search',         protect, validate(searchSchema), articlesController.search);
router.get('/',               protect,                          articlesController.getAll);
router.get('/:id/content',    protect,                          articlesController.fetchContent);
router.get('/:id',            protect,                          articlesController.getById);

export default router;
