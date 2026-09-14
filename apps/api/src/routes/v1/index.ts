import { Router } from 'express';
import { env } from '../../config/env.js';
import { healthRoutes } from './health.routes.js';
import { testRoutes } from './test.routes.js';

const v1Router = Router();

// Core health check: /api/v1/health
v1Router.use('/health', healthRoutes);

// Future modular route mounts:
// v1Router.use('/auth', authRoutes);
// v1Router.use('/users', userRoutes);
// v1Router.use('/jobs', jobRoutes);
// v1Router.use('/applications', applicationRoutes);
// v1Router.use('/resume', resumeRoutes);

// Development/testing error routes
if (!env.isProduction) {
  v1Router.use('/test', testRoutes);
}

export { v1Router };