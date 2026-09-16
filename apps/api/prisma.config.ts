import { defineConfig, env } from 'prisma/config';
import dotenv from 'dotenv';

// Ensure .env is loaded in development/CLI environments
dotenv.config();

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
  },
});
