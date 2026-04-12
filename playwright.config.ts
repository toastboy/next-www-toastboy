import * as path from 'node:path';

import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

// CI uses port 3000 (no dev server conflict); local uses 3001 so playwright
// and the regular dev server can run simultaneously without clashing.
const BASE_URL = process.env.CI ? 'http://127.0.0.1:3000' : 'http://127.0.0.1:3001';

// Load playwright-specific env vars for local runs (no 1Password needed).
// CI sets its own env vars directly; we don't want to override them.
if (!process.env.CI) {
    dotenv.config({ path: path.join(__dirname, '.env.playwright'), override: true });
}

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    globalSetup: './e2e/global-setup.ts',
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
    reporter: process.env.CI ?
        [
            ['github'],
            ['html', { open: 'never' }],
        ] :
        [['html', { open: 'on-failure' }]],

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
        command: process.env.CI ? 'npm run start:ci' : 'npm run start:playwright',
        url: BASE_URL,
        stdout: 'pipe',
        stderr: 'pipe',
        reuseExistingServer: !process.env.CI,
    },
});
