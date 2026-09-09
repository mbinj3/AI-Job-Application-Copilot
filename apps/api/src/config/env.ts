import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from local .env or fallback
dotenv.config();

export interface EnvConfig {
  port: number;
  nodeEnv: 'development' | 'production' | 'test';
  corsOrigin: string;
  apiPrefix: string;
}

export const env: EnvConfig = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: (process.env.NODE_ENV as EnvConfig['nodeEnv']) || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  apiPrefix: process.env.API_PREFIX || '/api',
};
