import { Request, Response } from 'express';
import { HTTP_STATUS } from '@copilot/shared';
import { HealthService } from '../services/health.service.js';

export function getHealthCheck(req: Request, res: Response): void {
  const echo = typeof req.query.echo === 'string' ? req.query.echo : undefined;
  const healthData = HealthService.getHealthStatus(echo);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'API is healthy',
    data: healthData,
  });
}
