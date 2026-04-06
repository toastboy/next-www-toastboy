import path from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.join(dirname, 'src'),
            prisma: path.join(dirname, 'prisma'),
            'next/navigation': path.join(dirname, 'src/tests/__mocks__/next/navigation.ts'),
            'server-only': path.join(dirname, 'src/tests/__mocks__/server-only.ts'),
            types: path.join(dirname, 'src/types'),
        },
    },
    test: {
        name: 'components-vitest',
        environment: 'happy-dom',
        globals: true,
        include: ['src/components/**/*.vitest.spec.tsx'],
        exclude: ['**/src/services/**'],
        setupFiles: ['vitest.setup.frontend.ts'],
        coverage: {
            include: ['src/components/**/*.{ts,tsx}'],
        },
    },
});
