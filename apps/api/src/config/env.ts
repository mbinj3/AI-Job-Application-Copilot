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
}

const nodeEnv = (process.env.NODE_ENV as EnvConfig['nodeEnv']) || 'development';

export const env: EnvConfig = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  apiPrefix: process.env.API_PREFIX || '/api',
  logLevel: process.env.LOG_LEVEL || (nodeEnv === 'production' ? 'info' : 'debug'),
  isProduction: nodeEnv === 'production',
  isDevelopment: nodeEnv === 'development',
  isTest: nodeEnv === 'test',
  databaseUrl: process.env.DATABASE_URL || '',
};