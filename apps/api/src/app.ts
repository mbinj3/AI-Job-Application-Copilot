import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { requestLogger, notFoundHandler, errorHandler } from './middleware/index.js';
import { apiRouter } from './routes/index.js';

export function createApp(): Express {
  const app = express();

  // Security Headers
  app.use(helmet());

  // Cross-Origin Resource Sharing
  app.use(
    cors({
      origin: env.corsOrigin === '*' ? '*' : [env.corsOrigin, 'http://localhost:3000'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-request-id'],
    })
  );

  // Body Parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Structured HTTP Request Logging (Pino)
  app.use(requestLogger);

  // Mount API Router under configured prefix (e.g. /api -> /api/v1/*)
  app.use(env.apiPrefix, apiRouter);

  // 404 Resource Not Found Handler
  app.use(notFoundHandler);

  // Centralized Global Error Handler
  app.use(errorHandler);

  return app;
}