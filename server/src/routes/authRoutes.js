import { Router } from 'express';
import { register, login, getMe, updateProfile, updatePassword } from '../controllers/authController.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';
import { registerSchema, loginSchema, updateProfileSchema, updatePasswordSchema } from '../validators/authSchemas.js';

const router = Router();

// POST /api/v1/auth/register
router.post('/register', validate(registerSchema), register);

// POST /api/v1/auth/login
router.post('/login', validate(loginSchema), login);

// GET /api/v1/auth/me (Protected route)
router.get('/me', authenticateUser, getMe);

// PUT /api/v1/auth/profile
router.put('/profile', authenticateUser, validate(updateProfileSchema), updateProfile);

// PUT /api/v1/auth/password
router.put('/password', authenticateUser, validate(updatePasswordSchema), updatePassword);

export default router;
