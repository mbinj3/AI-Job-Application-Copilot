import { Request, Response } from 'express';
import { HTTP_STATUS } from '@copilot/shared';
import { checkDatabaseConnection } from '../db/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getDatabaseHealthCheck = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const result = await checkDatabaseConnection();

    if (result.connected) {
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Database connection is healthy',
        data: {
          status: 'ok',
          connected: true,
          latencyMs: result.latencyMs,
          timestamp: new Date().toISOString(),
        },
      });
    } else {
      // 503 — database unavailable, but API itself is alive
      res.status(503).json({
        success: false,
        message: 'Database connection is unavailable',
        data: {
          status: 'error',
          connected: false,
          timestamp: new Date().toISOString(),
        },
      });
    }
  }
);
