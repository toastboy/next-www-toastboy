import type { StorybookConfig } from '@storybook/nextjs-vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';
import { mergeConfig } from 'vite';

const storybookDir = path.dirname(fileURLToPath(import.meta.url));

// MSW 2.14.x added a checkGlobals() call as a module-level side effect in its
// core index, but declares "sideEffects": false in package.json. Rolldown
// tree-shakes the function definition away while keeping the call, causing a
// ReferenceError in the built Storybook. The check is a no-op in browsers
// (it only asserts typeof URL !== 'undefined'), so removing the call is safe.
const mswCheckGlobalsPlugin: Plugin = {
    name: 'msw-remove-checkglobals',
    transform(code, id) {
        if (id.includes('msw/lib/core/index')) {
            return code.replace(/\bcheckGlobals\(\);?/g, '');
        }
    },
};

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
        const baseConfig = mergeConfig(viteConfig, {
            plugins: [mswCheckGlobalsPlugin],
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
        const config = process.env.NODE_ENV !== 'test'
            ? mergeConfig(baseConfig, {
                server: {
                    fs: {
                        allow: [
                            path.resolve(projectRoot, 'src'),
                            path.resolve(projectRoot, 'node_modules'),
                        ],
                    },
                },
            })
            : baseConfig;
        return config;
    },
};

export default config;
