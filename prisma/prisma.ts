import 'server-only';

import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from 'prisma/generated/client';

let prisma: PrismaClient;
const databaseUrl =
    process.env.DATABASE_URL ??
    // Intentionally invalid credentials so build/lint/typecheck don't require secrets.
    'mysql://invalid:invalid@localhost:3306/invalid';
const adapter = new PrismaMariaDb(databaseUrl);

function createPrismaClient() {
    const enableQueryLogging = process.env.PRISMA_LOG_QUERIES === "true";

    return new PrismaClient({
        adapter,
        log: enableQueryLogging ? ['query', 'error', 'warn'] : ['error', 'warn'],
    });
}

if (process.env.NODE_ENV === "production") {
    prisma = createPrismaClient();
} else {
    const globalWithPrisma = global as typeof globalThis & { prisma: PrismaClient; };
    if (!globalWithPrisma.prisma) {
        globalWithPrisma.prisma = createPrismaClient();
    }
    prisma = globalWithPrisma.prisma;
}

export default prisma;
