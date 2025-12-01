import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@prisma/client';

const databaseUrl = process.env.DATABASE_URL;

let prisma: PrismaClient;

if (!databaseUrl) {
  if (process.env.NODE_ENV === 'test') {
    // In tests we always mock Prisma, so avoid hard-failing the watcher.
    prisma = createThrowingPrismaClient();
  } else {
    throw new Error('DATABASE_URL environment variable is required for Prisma');
  }
} else {
  prisma = createPrismaClient(databaseUrl);
}

export default prisma;

function createThrowingPrismaClient(): PrismaClient {
  const message =
    'Prisma client accessed without DATABASE_URL. Mock lib/prisma in tests.';

  return new Proxy({} as PrismaClient, {
    get() {
      throw new Error(message);
    },
  });
}

function createPrismaClient(databaseUrl: string): PrismaClient {
  const globalWithPrisma = global as typeof globalThis & {
    prisma?: PrismaClient;
    prismaAdapter?: PrismaMariaDb;
  };

  const adapter = globalWithPrisma.prismaAdapter ?? new PrismaMariaDb(databaseUrl);

  if (process.env.NODE_ENV !== 'production') {
    globalWithPrisma.prismaAdapter = adapter;
  }

  if (process.env.NODE_ENV === 'production') {
    return new PrismaClient({
      adapter,
      // log: ['error', 'warn'], // TODO: decide what to do about log levels in production
    });
  }

  globalWithPrisma.prisma ??= new PrismaClient({
    adapter,
    // log: ['query', 'error', 'warn'],
  });

  return globalWithPrisma.prisma;
}
