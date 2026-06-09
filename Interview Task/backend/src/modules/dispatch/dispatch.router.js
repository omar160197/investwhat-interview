import { Router } from 'express';
import { z } from 'zod';
import { protect, restrict } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import * as dispatchController from './dispatch.controller.js';

const router = Router();

const sendSchema = z.object({
  articleIds:   z.array(z.string()).min(1, 'At least one article is required'),
  audience:     z.enum(['all', 'specific']),
  recipientIds: z.array(z.string()).optional(),
}).refine(
  (data) => data.audience === 'all' || (data.recipientIds && data.recipientIds.length > 0),
  { message: 'recipientIds required when audience is specific' }
);

router.use(protect, restrict('admin'));

router.post('/',    validate(sendSchema), dispatchController.send);
router.get('/',                           dispatchController.getHistory);
router.get('/:id',                        dispatchController.getById);

export default router;
