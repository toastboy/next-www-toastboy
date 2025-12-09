import type { StorybookConfig } from '@storybook/nextjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding"
  ],
  "framework": "@storybook/nextjs",
  "staticDirs": [
    "../public"
  ],
  webpackFinal: async (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Stub server-only modules so client-rendered Storybook can import server components safely
      'server-only': path.resolve(__dirname, './mocks/server-only.ts'),
      // Mock data layer for stories that import GameDay service
      // Mock Next.js navigation hooks used in client components
      'next/navigation': path.resolve(__dirname, './mocks/next-navigation.mock.ts'),
      // Mock mailer to avoid bundling node built-ins (net/tls) in Storybook
      'lib/mail': path.resolve(__dirname, './mocks/mail.mock.ts'),
    };
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      net: false,
      tls: false,
      dns: false,
      child_process: false,
    };

    return config;
  }
};
export default config;
