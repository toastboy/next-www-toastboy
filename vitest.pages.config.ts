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
            components: path.join(dirname, 'src/components'),
            lib: path.join(dirname, 'src/lib'),
            prisma: path.join(dirname, 'prisma'),
            'prisma/prisma': path.join(dirname, 'prisma/__mocks__/prisma.ts'),
            'server-only': path.join(dirname, 'src/tests/__mocks__/server-only.ts'),
            services: path.join(dirname, 'src/services'),
            'next/navigation': path.join(dirname, 'src/tests/__mocks__/next/navigation.ts'),
            types: path.join(dirname, 'src/types'),
        },
    },
    test: {
        name: 'pages-vitest',
        environment: 'node',
        globals: true,
        include: [
            'src/app/*.vitest.spec.ts',
            'src/app/footy/**/*.vitest.spec.ts',
            'src/app/footy/**/*.vitest.spec.tsx',
        ],
        setupFiles: ['vitest.setup.backend.ts'],
        coverage: {
            include: [
                'src/app/*.{ts,tsx}',
                'src/app/footy/**/*.{ts,tsx}',
            ],
        },
    },
});
