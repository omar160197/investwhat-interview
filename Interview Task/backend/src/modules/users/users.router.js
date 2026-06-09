import { Router } from 'express';
import { z } from 'zod';
import { protect, restrict } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import * as usersController from './users.controller.js';

const router = Router();

const preferencesSchema = z.object({
  topics: z.array(z.string()).min(1, 'At least one topic required'),
});

router.use(protect);

router.get('/',    restrict('admin'), usersController.getAll);
router.get('/:id',                   usersController.getById);
router.patch('/:id',                 usersController.updateProfile);
router.patch('/:id/preferences', validate(preferencesSchema), usersController.updatePreferences);
router.delete('/:id', restrict('admin'), usersController.deleteUser);

export default router;
