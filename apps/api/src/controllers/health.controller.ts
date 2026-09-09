import { Request, Response } from 'express';
import { HealthCheckResponse, HTTP_STATUS } from '@copilot/shared';
import { env } from '../config/env.js';

export function getHealthCheck(_req: Request, res: Response): void {
  const responseData: HealthCheckResponse = {
    status: 'ok',
    service: 'ai-job-application-copilot-api',
    version: '0.1.0',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    environment: env.nodeEnv,
  };

  res.status(HTTP_STATUS.OK).json(responseData);
}
