import { PrismaClient } from '@prisma/client';
import { getSecrets } from './secrets';

let prisma: PrismaClient;

function newPrismaClient(): PrismaClient {
  const secret = getSecrets();

  return new PrismaClient({
    datasources: {
      db: {
        url: secret.DATABASE_URL,
      },
    },
  });
}

if (process.env.NODE_ENV === "production") {
  prisma = newPrismaClient();
} else {
  const globalWithPrisma = global as typeof globalThis & { prisma: PrismaClient; };
  if (!globalWithPrisma.prisma) {
    globalWithPrisma.prisma = newPrismaClient();
  }
  prisma = globalWithPrisma.prisma;
}

export default prisma;
