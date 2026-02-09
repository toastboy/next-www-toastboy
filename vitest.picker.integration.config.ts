import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

const currentDirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    resolve: {
        alias: {
            '@': path.join(currentDirname, 'src'),
            prisma: path.join(currentDirname, 'prisma'),
            'server-only': path.join(currentDirname, 'src/tests/__mocks__/server-only.ts'),
            types: path.join(currentDirname, 'src/types'),
        },
    },
    test: {
        name: 'picker-integration-vitest',
        environment: 'node',
        globals: true,
        include: ['src/lib/actions/submitPicker/**/*.integration.vitest.spec.ts'],
    },
});
