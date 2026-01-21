import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    resolve: {
        alias: {
            '@': path.join(dirname, 'src'),
            prisma: path.join(dirname, 'prisma'),
            'prisma/prisma': path.join(dirname, 'src/tests/__mocks__/prisma/prisma.vitest.ts'),
            'server-only': path.join(dirname, 'src/tests/__mocks__/server-only.ts'),
            supertest: path.join(dirname, 'src/tests/lib/api/supertest-mock.ts'),
            types: path.join(dirname, 'src/types'),
        },
    },
    test: {
        name: 'api-vitest',
        environment: 'node',
        globals: true,
        include: ['src/tests/api/**/*.vitest.spec.ts'],
        exclude: ['**/src/tests/services/**', '**/src/tests/components/**'],
        setupFiles: ['vitest.setup.backend.ts'],
        coverage: {
            include: ['src/app/api/**/*.{ts,tsx}'],
            exclude: [
                '**/prisma/**',
                '.storybook/**',
                'src/stories/**',
                'src/tests/**',
                'src/**/__mocks__/**',
                'src/actions/**',
                'src/lib/**',
                'src/components/**',
                'src/services/**',
                'src/types/**',
                'public/**',
                '**/*.stories.*',
            ],
            reporter: ['text', 'lcov', 'cobertura'],
            reportsDirectory: 'coverage',
        },
    },
});
