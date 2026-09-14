import { Router } from 'express';
import { getHealthCheck } from '../../controllers/health.controller.js';
import { validate } from '../../middleware/validate.js';
import { healthQuerySchema } from '../../schemas/health.schema.js';

const router = Router();

router.get('/', validate({ query: healthQuerySchema }), getHealthCheck);

export const healthRoutes = router;