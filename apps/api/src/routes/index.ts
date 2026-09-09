import { Router } from 'express';
import { healthRoutes } from './health.routes.js';

const apiRouter = Router();

// Health check endpoint -> /api/health
apiRouter.use('/health', healthRoutes);

// Future modular route mounts:
// apiRouter.use('/auth', authRoutes);
// apiRouter.use('/resumes', resumeRoutes);
// apiRouter.use('/jobs', jobRoutes);
// apiRouter.use('/ai', aiRoutes);

export { apiRouter };
