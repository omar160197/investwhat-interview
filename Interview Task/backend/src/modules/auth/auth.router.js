import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../../middleware/validate.middleware.js';
import { protect } from '../../middleware/auth.middleware.js';
import * as authController from './auth.controller.js';

const router = Router();

const registerSchema = z.object({
  name:     z.string().min(2, 'Name must be at least 2 characters'),
  email:    z.email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role:     z.enum(['user', 'admin']).optional(),
});

const loginSchema = z.object({
  email:    z.email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

router.post('/register', validate(registerSchema), authController.register);
router.post('/login',    validate(loginSchema),    authController.login);
router.post('/refresh',                            authController.refresh);
router.post('/logout',   protect,                  authController.logout);
router.get('/me',        protect,                  authController.me);

export default router;
