import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '@copilot/shared';
import { env } from '../config/env.js';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  details?: Record<string, unknown> | Array<unknown>;
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const code = err.code || 'INTERNAL_SERVER_ERROR';
  const message = err.message || 'An unexpected error occurred';

  console.error(`[Error] [${code}] ${message}`, err.stack);

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(env.nodeEnv === 'development' && { details: err.details, stack: err.stack }),
    },
    meta: {
      timestamp: new Date().toISOString(),
    },
  });
}
