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
                '.storybook/**',
                '**/__mocks__/**',
                '**/*.stories.*',
                '**/*.test.ts',
                '**/*.test.tsx',
                '**/*.vitest.spec.ts',
                '**/*.vitest.spec.tsx',
                '**/*Skeleton*',
                '**/index.ts',
                '**/prisma/**',
                'public/**',
                'src/app/api/auth/**', // Better Auth handler — nothing to unit test here
                'src/app/footy/docs/**', // MDX-only pages, nothing to unit test
                'src/lib/auth.client.ts', // thin glue layer to Better Auth, nothing to unit test here
                'src/lib/exportdb/**', // dev-only utility
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
