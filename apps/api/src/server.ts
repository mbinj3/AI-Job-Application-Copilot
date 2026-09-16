import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { prisma, pool } from './db/index.js';

const app = createApp();

const server = app.listen(env.port, () => {
  logger.info(
    {
      port: env.port,
      environment: env.nodeEnv,
      healthEndpoint: `http://localhost:${env.port}${env.apiPrefix}/v1/health`,
      dbHealthEndpoint: `http://localhost:${env.port}${env.apiPrefix}/v1/health/db`,
    },
    `Server listening on http://localhost:${env.port}`
  );
});

// Graceful Shutdown
function gracefulShutdown(signal: string) {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);

  server.close(async () => {
    logger.info('HTTP server closed. Disconnecting database...');

    try {
      await prisma.$disconnect();
      await pool.end();
      logger.info('Database disconnected. Exiting process.');
    } catch (err) {
      logger.error({ err }, 'Error disconnecting from database during shutdown.');
    } finally {
      process.exit(0);
    }
  });

  // Force close after 10 seconds if lingering connections exist
  const forceTimer = setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down.');
    process.exit(1);
  }, 10000);

  forceTimer.unref();
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
