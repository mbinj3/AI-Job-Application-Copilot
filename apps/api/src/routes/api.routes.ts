import { Router } from 'express';
import { v1Router } from './v1/index.js';
import { healthRoutes } from './v1/health.routes.js';

const apiRouter = Router();

// Version 1 routes: /api/v1/*
apiRouter.use('/v1', v1Router);

// Frontend backward compatibility alias: /api/health -> /api/v1/health
apiRouter.use('/health', healthRoutes);

export { apiRouter };