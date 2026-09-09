import { Router } from 'express';
import { getHealthCheck } from '../controllers/health.controller.js';

const router = Router();

// GET /api/health
router.get('/', getHealthCheck);

export const healthRoutes = router;
