import { Router } from 'express';
import { getHealthCheck } from '../../controllers/health.controller.js';
import { getDatabaseHealthCheck } from '../../controllers/health-db.controller.js';
import { validate } from '../../middleware/validate.js';
import { healthQuerySchema } from '../../schemas/health.schema.js';

const router = Router();

// GET /api/v1/health
router.get('/', validate({ query: healthQuerySchema }), getHealthCheck);

// GET /api/v1/health/db
router.get('/db', getDatabaseHealthCheck);

export const healthRoutes = router;