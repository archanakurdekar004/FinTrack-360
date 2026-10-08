import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';
import { registerSchema, loginSchema } from '../validators/authSchemas.js';

const router = Router();

// POST /api/v1/auth/register
router.post('/register', validate(registerSchema), register);

// POST /api/v1/auth/login
router.post('/login', validate(loginSchema), login);

// GET /api/v1/auth/me (Protected route)
router.get('/me', authenticateUser, getMe);

export default router;
