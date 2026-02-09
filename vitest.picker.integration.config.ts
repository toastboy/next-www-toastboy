import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    resolve: {
        alias: {
            '@': path.join(dirname, 'src'),
            prisma: path.join(dirname, 'prisma'),
            'server-only': path.join(dirname, 'src/tests/__mocks__/server-only.ts'),
            types: path.join(dirname, 'src/types'),
        },
    },
    test: {
        name: 'picker-integration-vitest',
        environment: 'node',
        globals: true,
        include: ['src/lib/actions/submitPicker/**/*.integration.vitest.spec.ts'],
    },
});
