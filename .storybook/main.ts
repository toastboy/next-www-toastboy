import type { StorybookConfig } from '@storybook/nextjs-vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mergeConfig } from 'vite';

const storybookDir = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
    "stories": [
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
    // TODO: I had managed to get rid of these aliases in the app code, but
    // Storybook still needs them. Perhaps I need to rethink my aliases
    // altogether - maybe even get rid.
    "viteFinal": async (viteConfig) =>
        mergeConfig(viteConfig, {
            resolve: {
                alias: {
                    '@': path.resolve(storybookDir, '../src'),
                    prisma: path.resolve(storybookDir, '../prisma'),
                },
            },
        }),
};

export default config;
