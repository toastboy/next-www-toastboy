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
                'src/actions/**/*.{ts,tsx}',
                'src/app/api/**/*.{ts,tsx}',
                'src/app/footy/**/*.{ts,tsx}',
                'src/components/**/*.{ts,tsx}',
                'src/lib/**/*.{ts,tsx}',
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
                'src/app/api/auth/**', // Better Auth handler — nothing to unit test here
                'src/app/footy/docs/**', // MDX-only pages, nothing to unit test
                'src/lib/importlivedb/**', // dev-only utility
                'src/stories/**',
                'src/tests/**',
                'src/types/**',
            ],
            reporter: ['text', 'lcov', 'cobertura'],
            reportsDirectory: 'coverage',
        },
    },
});
