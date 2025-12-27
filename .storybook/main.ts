import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';
import { fileURLToPath } from 'url';
import tsconfigPaths from 'vite-tsconfig-paths';

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
        '@chromatic-com/storybook',
        '@storybook/addon-vitest'
    ],
    "framework": "@storybook/react-vite",
    "staticDirs": [
        "../public"
    ],
    viteFinal: async (config) => {
        config.plugins = config.plugins || [];
        config.plugins.push(tsconfigPaths());
        config.define = {
            ...(config.define || {}),
            'process.env': {},
        };
        config.esbuild = {
            ...(config.esbuild || {}),
            jsx: 'automatic',
            jsxImportSource: 'react',
        };
        config.resolve = config.resolve || {};
        config.resolve.alias = {
            ...(config.resolve.alias || {}),
            // Stub Prisma so it never reaches node-only runtime in Storybook
            'prisma/prisma': path.resolve(__dirname, './mocks/prisma.mock.ts'),
            'prisma/generated': path.resolve(__dirname, './mocks/prisma-generated.mock.ts'),
            // Stub server-only modules so client-rendered Storybook can import server components safely
            'server-only': path.resolve(__dirname, './mocks/server-only.ts'),
            // Mock Next.js navigation hooks used in client components
            'next/navigation': path.resolve(__dirname, './mocks/next-navigation.mock.ts'),
            // Mock Next.js link to avoid process.env usage in Storybook
            'next/link': path.resolve(__dirname, './mocks/next-link.mock.tsx'),
            // Mock Next.js image so static assets render in Storybook
            'next/image': path.resolve(__dirname, './mocks/next-image.mock.tsx'),
            // Stub Next cache helpers used by server actions
            'next/cache': path.resolve(__dirname, './mocks/next-cache.mock.ts'),
            // Stub secrets to avoid process.env + fs access in Storybook
            '@/lib/secrets': path.resolve(__dirname, './mocks/secrets.mock.ts'),
            // Stub mailer to avoid nodemailer in Storybook
            '@/actions/sendEmail': path.resolve(__dirname, './mocks/actions-sendEmail.mock.ts'),
            // Path aliases matching tsconfig - still need zod schema imports to work
            'prisma': path.resolve(__dirname, '../prisma'),
            '@': path.resolve(__dirname, '../src'),
        };

        return config;
    },
};
export default config;
