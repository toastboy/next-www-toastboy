import { defineConfig } from 'prisma/config';

export default defineConfig({
    schema: './prisma/schema.prisma',
    migrations: {
        path: './prisma/migrations',
        seed: 'ts-node -r tsconfig-paths/register --project tsconfig.scripts.json --compiler-options {"module":"CommonJS"} prisma/seed.ts',
    },
});
