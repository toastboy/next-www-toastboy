import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        // Prevent the root config from collecting tests; use explicit projects instead.
        include: [],
        projects: [
            'vitest.components.config.ts',
            'vitest.storybook.config.ts',
        ],
    },
});
