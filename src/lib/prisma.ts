import 'server-only';
import 'dotenv/config';

import { PrismaMariaDb } from '@prisma/adapter-mariadb';

import { PrismaClient } from '@/generated/prisma/client';

let prisma: PrismaClient;
const databaseUrl =
  process.env.DATABASE_URL ??
  // Intentionally invalid credentials so build/lint/typecheck don't require secrets.
  'mysql://invalid:invalid@localhost:3306/invalid';
const adapter = new PrismaMariaDb(databaseUrl);

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({
    adapter,
    // log: ['error', 'warn'], // TODO: decide what to do about log levels in production
  });
} else {
  const globalWithPrisma = global as typeof globalThis & { prisma: PrismaClient; };
  if (!globalWithPrisma.prisma) {
    globalWithPrisma.prisma = new PrismaClient({
      adapter,
      // log: ['query', 'error', 'warn'],
    });
  }
  prisma = globalWithPrisma.prisma;
}

export default prisma;
