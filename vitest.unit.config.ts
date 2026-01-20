import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        // Prevent the root config from collecting tests; use explicit projects instead.
        include: [],
        projects: [
            'vitest.components.config.ts',
            'vitest.services.config.ts',
        ],
        coverage: {
            include: [
                'src/components/**/*.{ts,tsx}',
                'src/services/**/*.{ts,tsx}',
            ],
            exclude: [
                '.storybook/**',
                '**/*.stories.*',
                '**/*.test.tsx',
                '**/prisma/**',
                'public/**',
                'src/**/__mocks__/**',
                'src/actions/**',
                'src/lib/**',
                'src/stories/**',
                'src/tests/**',
                'src/types/**',
            ],
            reporter: ['text', 'lcov', 'cobertura'],
            reportsDirectory: 'coverage',
        },
    },
});
