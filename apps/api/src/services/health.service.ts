import { APP_CONFIG } from '@copilot/shared';
import { env } from '../config/env.js';

export interface HealthCheckData {
  status: 'ok';
  service: string;
  version: string;
  environment: string;
  uptime: number;
  timestamp: string;
  echo?: string;
}

export class HealthService {
  public static getHealthStatus(echo?: string): HealthCheckData {
    return {
      status: 'ok',
      service: 'ai-job-application-copilot-api',
      version: APP_CONFIG.VERSION,
      environment: env.nodeEnv,
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      ...(echo ? { echo } : {}),
    };
  }
}

