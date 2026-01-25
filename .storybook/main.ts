import type { StorybookConfig } from '@storybook/nextjs-vite';
import path from 'path';
import { fileURLToPath } from 'url';

const config: StorybookConfig = {
    "stories": [
        "../src/**/*.mdx",
        "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
    ],
    "addons": [
        "@chromatic-com/storybook",
        "@storybook/addon-vitest",
        "@storybook/addon-a11y",
        "@storybook/addon-docs"
    ],
    "framework": "@storybook/nextjs-vite",
    "staticDirs": [
        "../public"
    ],
    async viteFinal(baseConfig) {
        const storybookDir = path.dirname(fileURLToPath(import.meta.url));
        baseConfig.resolve = baseConfig.resolve ?? {};
        const alias = baseConfig.resolve.alias ?? [];
        const aliasArray = Array.isArray(alias)
            ? alias
            : Object.entries(alias).map(([find, replacement]) => ({ find, replacement }));
        baseConfig.resolve.alias = [
            ...aliasArray,
            { find: '@/actions', replacement: path.resolve(storybookDir, './mocks/actions') },
        ];

        return baseConfig;
    },
};

export default config;
