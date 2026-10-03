import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { signupSchema, loginSchema } from '../../schemas/auth.schema.js';
import { signup, login } from '../../controllers/auth.controller.js';

const router = Router();

// POST /api/v1/auth/signup
router.post('/signup', validate({ body: signupSchema }), signup);

// POST /api/v1/auth/login
router.post('/login', validate({ body: loginSchema }), login);

// Future Task 3 routes (do not implement here):
// router.post('/logout', logout);
// router.post('/refresh', refreshToken);
// router.get('/me', requireAuth, getMe);

export const authRoutes = router;