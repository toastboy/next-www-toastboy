import type { StorybookConfig } from '@storybook/nextjs';
import path from 'path';
import { fileURLToPath } from 'url';
import webpack from 'webpack';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
    "stories": [
        "../src/**/*.mdx",
        "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
    ],
    "addons": [
        "@storybook/addon-a11y",
        "@storybook/addon-docs",
        "@storybook/addon-onboarding",
        "msw-storybook-addon",
        '@chromatic-com/storybook'
    ],
    "framework": "@storybook/nextjs",
    "staticDirs": [
        "../public"
    ],
    webpackFinal: async (config) => {
        config.resolve = config.resolve || {};
        config.resolve.alias = {
            ...(config.resolve.alias || {}),
            // Avoid bundling Prisma client and Node-only deps in Storybook
            'prisma/prisma$': path.resolve(__dirname, './mocks/prisma.mock.ts'),
            // Path aliases matching tsconfig
            '@': path.resolve(__dirname, '../src'),
            'prisma': path.resolve(__dirname, '../prisma'),
            // Mock server action used by client component in stories
            'actions/updatePlayerRecords': path.resolve(__dirname, './mocks/actions-updatePlayerRecords.mock.ts'),
            // Stub server-only modules so client-rendered Storybook can import server components safely
            'server-only': path.resolve(__dirname, './mocks/server-only.ts'),
            // Mock Next.js navigation hooks used in client components
            'next/navigation': path.resolve(__dirname, './mocks/next-navigation.mock.ts'),
            // Mock mailer to avoid bundling node built-ins (net/tls) in Storybook
            'lib/mail': path.resolve(__dirname, './mocks/mail.mock.ts'),
        };
        config.resolve.fallback = {
            ...(config.resolve.fallback || {}),
            async_hooks: false,
            buffer: false,
            crypto: false,
            events: false,
            fs: false,
            module: false,
            os: false,
            path: false,
            process: false,
            url: false,
            net: false,
            tls: false,
            dns: false,
            child_process: false,
        };
        config.plugins = [
            ...(config.plugins || []),
            // Strip node: scheme so webpack can apply fallbacks/aliases.
            new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
                resource.request = resource.request.replace(/^node:/, '');
            }),
        ];

        return config;
    }
};
export default config;
