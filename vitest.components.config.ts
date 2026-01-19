import { defineConfig } from 'vitest/config';

export default defineConfig({
    esbuild: {
        jsx: 'automatic',
    },
    test: {
        name: 'components-vitest',
        environment: 'jsdom',
        globals: true,
        include: ['src/components/**/*.vitest.spec.tsx'],
        exclude: ['**/src/tests/services/**'],
        setupFiles: ['vitest.setup.frontend.ts'],
        coverage: {
            include: ['src/components/**/*.{ts,tsx}'],
            exclude: [
                '.storybook/**',
                'src/stories/**',
                'src/tests/**',
                'src/**/__mocks__/**',
                'prisma/**',
                'src/actions/**',
                'src/lib/**',
                'src/services/**',
                'src/types/**',
                'public/**',
                '**/*.stories.*',
            ],
        },
    },
});
