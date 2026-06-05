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
    "viteFinal": async (viteConfig) => {
        const projectRoot = path.resolve(storybookDir, '..');
        let config = mergeConfig(viteConfig, {
            resolve: {
                alias: {
                    '@': path.resolve(projectRoot, 'src'),
                    prisma: path.resolve(projectRoot, 'prisma'),
                },
            },
        });
        // On macOS volume mounts (e.g. /Volumes/…) the Storybook UI's vitest
        // runner constructs module fetch URLs from the full absolute filesystem
        // path instead of a path relative to the server root, causing 404s.
        // Restricting fs.allow to src/ fixes this without exposing the rest of
        // the repo through the dev server. Skipped in NODE_ENV=test (CLI vitest
        // / CI) because the CLI runner resolves paths correctly on its own.
        if (process.env.NODE_ENV !== 'test') {
            config = mergeConfig(config, {
                server: {
                    fs: {
                        allow: [
                            path.resolve(projectRoot, 'src'),
                        ],
                    },
                },
            });
        }
        return config;
    },
};

export default config;
