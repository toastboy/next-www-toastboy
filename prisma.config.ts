import 'dotenv/config';

import { defineConfig, env } from 'prisma/config';

// Schema commands (migrate/db push) need DDL privileges, unlike the app's
// runtime DATABASE_URL (SELECT/INSERT/UPDATE/DELETE only - see SYS-444), so
// the Prisma CLI is pointed at its own, more privileged, connection string.
const migrateDatabaseUrl =
    process.env.MIGRATE_DATABASE_URL ??
    // Intentionally invalid credentials so `prisma generate` can run without secrets,
    // while commands that need a real DB will fail fast.
    'mysql://invalid:invalid@localhost:3306/invalid';

const shadowDatabaseUrl = process.env.SHADOW_DATABASE_URL;

export default defineConfig({
    schema: 'prisma/schema.prisma',
    migrations: {
        path: 'prisma/migrations',
        seed: 'npx tsx -r tsconfig-paths/register prisma/seed.ts',
    },
    datasource: {
        url: process.env.MIGRATE_DATABASE_URL
            ? env('MIGRATE_DATABASE_URL')
            : migrateDatabaseUrl,
        ...(shadowDatabaseUrl ? { shadowDatabaseUrl } : {}),
    },
});
