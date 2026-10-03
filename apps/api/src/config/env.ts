import dotenv from 'dotenv';

dotenv.config();

export interface EnvConfig {
  port: number;
  nodeEnv: 'development' | 'production' | 'test';
  corsOrigin: string;
  apiPrefix: string;
  logLevel: string;
  isProduction: boolean;
  isDevelopment: boolean;
  isTest: boolean;
  databaseUrl: string;
  jwtAccessSecret: string;
  jwtRefreshSecret: string;
}

const nodeEnv = (process.env.NODE_ENV as EnvConfig['nodeEnv']) || 'development';
const MIN_SECRET_LENGTH = 32;
const DEV_JWT_ACCESS_FALLBACK = 'dev-only-access-secret-change-before-production-abc123';
const DEV_JWT_REFRESH_FALLBACK = 'dev-only-refresh-secret-change-before-production-xyz789';

function resolveJwtSecret(envVar: string, name: string, fallback: string, isProd: boolean): string {
  const value = process.env[envVar];
  if (isProd) {
    if (!value || value.length < MIN_SECRET_LENGTH) {
      throw new Error(
        `[env] FATAL: ${name} must be set to a string of at least ${MIN_SECRET_LENGTH} characters in production. ` +
          `Set ${envVar} in your environment.`
      );
    }
    return value;
  }
  
  if (!value) {
    console.warn(
      `[env] WARNING: ${envVar} is not set. Using an insecure fallback. ` +
        'Set this variable before deploying to production.'
    );
    return fallback;
  }
  return value;
}

const isProduction = nodeEnv === 'production';

export const env: EnvConfig = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  apiPrefix: process.env.API_PREFIX || '/api',
  logLevel: process.env.LOG_LEVEL || (nodeEnv === 'production' ? 'info' : 'debug'),
  isProduction,
  isDevelopment: nodeEnv === 'development',
  isTest: nodeEnv === 'test',
  databaseUrl: process.env.DATABASE_URL || '',
  jwtAccessSecret: resolveJwtSecret('JWT_ACCESS_SECRET', 'JWT_ACCESS_SECRET', DEV_JWT_ACCESS_FALLBACK, isProduction),
  jwtRefreshSecret: resolveJwtSecret('JWT_REFRESH_SECRET', 'JWT_REFRESH_SECRET', DEV_JWT_REFRESH_FALLBACK, isProduction),
};