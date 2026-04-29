import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        // Prevent the root config from collecting tests; use explicit projects instead.
        include: [],
        projects: [
            'vitest.actions.config.ts',
            'vitest.api.config.ts',
            'vitest.components.config.ts',
            'vitest.pages.config.ts',
            'vitest.services.config.ts',
            'vitest.lib.config.ts',
        ],
        coverage: {
            include: [
                'src/app/api/**/*.{ts,tsx}',
                'src/components/**/*.{ts,tsx}',
                'src/lib/actions/**/*.{ts,tsx}',
                'src/services/**/*.{ts,tsx}',
            ],
            exclude: [
                '**/__mocks__/**',
                '**/*.stories.*',
                '**/*.vitest.spec.ts',
                '**/*.vitest.spec.tsx',
                '**/*.test.ts',
                '**/*.test.tsx',
                '**/*Skeleton*',
                '**/index.ts',
                '**/prisma/**',
                '.storybook/**',
                'public/**',
                'src/actions/**',
                'src/stories/**',
                'src/tests/**',
                'src/types/**',
            ],
            reporter: ['text', 'lcov', 'cobertura'],
            reportsDirectory: 'coverage',
        },
    },
});
