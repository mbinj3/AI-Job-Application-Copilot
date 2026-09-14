import pino from 'pino';
import { env } from './env.js';

const isDev = env.isDevelopment;

export const logger = pino({
  level: env.logLevel,
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'req.headers["x-api-key"]',
      'req.body.password',
      'req.body.token',
      'req.body.apiKey',
      'req.body.secret',
      'body.password',
      'body.token',
      'body.apiKey',
      'body.secret',
      'password',
      'token',
      'apiKey',
      'secret',
      '*.password',
      '*.token',
      '*.apiKey',
      '*.secret',
      '*.authorization',
    ],
    censor: '[REDACTED]',
  },
  ...(isDev
    ? {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        },
      }
    : {
        timestamp: pino.stdTimeFunctions.isoTime,
      }),
});

export type Logger = typeof logger;