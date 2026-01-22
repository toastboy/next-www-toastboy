import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    esbuild: {
        jsx: 'automatic',
    },
    resolve: {
        alias: {
            '@': path.join(dirname, 'src'),
            prisma: path.join(dirname, 'prisma'),
            'next/navigation': path.join(dirname, 'src/tests/__mocks__/next/navigation.ts'),
            types: path.join(dirname, 'src/types'),
        },
    },
    test: {
        name: 'components-vitest',
        environment: 'jsdom',
        globals: true,
        include: ['src/components/**/*.vitest.spec.tsx'],
        exclude: ['**/src/services/**'],
        setupFiles: ['vitest.setup.frontend.ts'],
        coverage: {
            include: ['src/components/**/*.{ts,tsx}'],
        },
    },
});
