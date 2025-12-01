import { defineConfig, env } from 'prisma/config';

export default defineConfig({
    datasource: {
        url: env('DATABASE_URL'),
    },
    schema: './prisma/schema.prisma',
    migrations: {
        path: './prisma/migrations',
        seed: 'ts-node -r tsconfig-paths/register --project tsconfig.scripts.json --compiler-options {"module":"CommonJS"} prisma/seed.ts',
    },
});
