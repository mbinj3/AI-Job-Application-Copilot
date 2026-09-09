import { createApp } from './app.js';
import { env } from './config/env.js';

const app = createApp();

const server = app.listen(env.port, () => {
  console.log(`[API Server] Running in '${env.nodeEnv}' mode`);
  console.log(`[API Server] Listening on http://localhost:${env.port}`);
  console.log(
    `[API Server] Health check available at: http://localhost:${env.port}${env.apiPrefix}/health`
  );
});

// Graceful Shutdown
function gracefulShutdown(signal: string) {
  console.log(`\n[API Server] Received ${signal}. Starting graceful shutdown...`);
  server.close(() => {
    console.log('[API Server] Closed remaining connections. Exiting process.');
    process.exit(0);
  });

  // Force close after 10 seconds if lingering
  setTimeout(() => {
    console.error('[API Server] Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
