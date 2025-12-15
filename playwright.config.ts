import * as path from 'node:path';

import { defineConfig, devices } from '@playwright/test';

// Extract base URL to a constant to avoid duplication.
const BASE_URL = 'http://127.0.0.1:3000';

// Extract env file path using robust path resolution.
const ENV_PATH = path.join(__dirname, '.env');

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    testDir: './e2e',
    timeout: 120000, // 2 minutes for tests with many stories
    expect: {
        timeout: 10000,
    },
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: process.env.CI
        ? [
            ['github'],
            ['html', { open: 'never' }],
        ]
        : [['html', { open: 'on-failure' }]],

    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL: BASE_URL,

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'on-first-retry',

        /* I want to see screenshots only on failure */
        screenshot: 'only-on-failure',

        /* For figuring out what went wrong with failed or flaky tests, like the drinkers page in Firefox */
        video: 'retain-on-failure',
    },

    /* Configure projects for major browsers */
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },

        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },

        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },

        /* Test against mobile viewports. */
        // {
        //   name: 'Mobile Chrome',
        //   use: { ...devices['Pixel 5'] },
        // },
        // {
        //   name: 'Mobile Safari',
        //   use: { ...devices['iPhone 12'] },
        // },

        /* Test against branded browsers. */
        // {
        //   name: 'Microsoft Edge',
        //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
        // },
        // {
        //   name: 'Google Chrome',
        //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
        // },
    ],

    /* Run your local dev server before starting the tests */
    webServer: {
        command: process.env.CI
            ? 'npm run start:ci'
            : 'op run --env-file ./.env -- npm run dev',
        url: 'http://127.0.0.1:3000',
        stdout: 'pipe',
        stderr: 'pipe',
        // See https://playwright.dev/docs/test-advanced
        reuseExistingServer: !process.env.CI,
    },
});
