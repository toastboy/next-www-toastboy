import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    resolve: {
        alias: {
            '@': path.join(dirname, 'src'),
            prisma: path.join(dirname, 'prisma'),
            'prisma/prisma': path.join(dirname, 'prisma/__mocks__/prisma.ts'),
            'server-only': path.join(dirname, 'src/tests/__mocks__/server-only.ts'),
            types: path.join(dirname, 'src/types'),
        },
    },
    test: {
        name: 'services-vitest',
        environment: 'node',
        globals: true,
        include: ['src/services/**/*.vitest.spec.ts', 'src/services/**/*.vitest.spec.tsx'],
        exclude: ['**/src/tests/api/**', '**/src/tests/components/**'],
        setupFiles: ['vitest.setup.backend.ts'],
        coverage: {
            include: ['src/services/**/*.{ts,tsx}'],
        },
    },
});
