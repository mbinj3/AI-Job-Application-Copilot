import { prisma } from './prisma.js';
import { logger } from '../config/logger.js';

export interface DatabaseHealthResult {
  connected: boolean;
  latencyMs?: number;
  error?: string;
}

export async function checkDatabaseConnection(): Promise<DatabaseHealthResult> {
  const start = Date.now();

  try {
    await prisma.$queryRaw`SELECT 1`;

    const latencyMs = Date.now() - start;

    return {
      connected: true,
      latencyMs,
    };
  } catch (err) {
    const latencyMs = Date.now() - start;

    logger.error(
      { err, latencyMs },
      'Database connectivity check failed'
    );

    return {
      connected: false,
      latencyMs,
      error: 'Database connection unavailable',
    };
  }
}
