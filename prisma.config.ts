import 'dotenv/config';

import { defineConfig, env } from 'prisma/config';

const databaseUrl =
    process.env.DATABASE_URL ??
    // Intentionally invalid credentials so `prisma generate` can run without secrets,
    // while commands that need a real DB will fail fast.
    'mysql://invalid:invalid@localhost:3306/invalid';

const shadowDatabaseUrl = process.env.SHADOW_DATABASE_URL;

export default defineConfig({
    schema: 'prisma/schema.prisma',
    migrations: {
        path: 'prisma/migrations',
        seed: 'npm run generate && tsx -r tsconfig-paths/register prisma/seed.ts',
    },
    datasource: {
        url: process.env.DATABASE_URL ? env('DATABASE_URL') : databaseUrl,
        ...(shadowDatabaseUrl ? { shadowDatabaseUrl } : {}),
    },
});
