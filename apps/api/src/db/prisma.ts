import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { env } from '../config/env.js';

// Extend globalThis to hold the dev singleton
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

export const pool: Pool =
  globalForPrisma.pool ??
  new Pool({
    connectionString: env.databaseUrl,
  });

const adapter = new PrismaPg(pool);

export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: env.isDevelopment
      ? ['query', 'info', 'warn', 'error']
      : ['warn', 'error'],
  });

// In development, persist the instances on globalThis to survive hot-reloads
if (env.isDevelopment) {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool;
}
