import * as path from 'node:path';

import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

/* CI uses port 3000 (no dev server conflict); local uses 3002 so playwright and
   the regular dev server can run simultaneously without clashing. */
const BASE_URL = process.env.CI ? 'http://127.0.0.1:3000' : 'http://127.0.0.1:3002';

/* Load playwright-specific env vars for local runs (no 1Password needed). CI
   sets its own env vars directly; we don't want to override them. */
if (!process.env.CI) {
    dotenv.config({ path: path.join(__dirname, '.env.playwright'), override: true });
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    globalSetup: './e2e/global-setup.ts',
    testDir: './e2e',

    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Never retry: I don't want flaky tests to hide real issues */
    retries: 0,
    /* Opt out of parallel tests. */
    workers: 1,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: process.env.CI ?
        [
            ['github'],
            ['html', { open: 'never' }],
        ] :
        [['html', { open: 'on-failure' }]],

    /* Shared settings for all the projects below. See
    https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL: BASE_URL,

        /* Collect trace when retrying the failed test. See
        https://playwright.dev/docs/trace-viewer */
        trace: 'on-first-retry',

        /* I want to see screenshots only on failure */
        screenshot: 'only-on-failure',

        /* For figuring out what went wrong with failed or flaky tests, like the
        drinkers page in Firefox */
        video: 'retain-on-failure',
    },

    /* Configure projects for major browsers */
    projects: [
        /* Teardown projects: reseed the database after each browser project so
         * the next browser always starts from a known state. globalSetup seeds
         * before the first browser; these handle every subsequent one. Each
         * browser project needs its own uniquely-named teardown project -
         * Playwright only runs a teardown once all projects referencing it have
         * finished, so sharing a single teardown across every browser project
         * would reseed just once at the very end instead of between each one. */
        {
            name: 'seed-chromium',
            testMatch: 'e2e/seed.setup.ts',
        },
        {
            name: 'seed-firefox',
            testMatch: 'e2e/seed.setup.ts',
        },
        {
            name: 'seed-webkit',
            testMatch: 'e2e/seed.setup.ts',
        },
        {
            name: 'seed-mobile',
            testMatch: 'e2e/seed.setup.ts',
        },
        {
            name: 'seed-tablet',
            testMatch: 'e2e/seed.setup.ts',
        },

        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
            teardown: 'seed-chromium',
        },

        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
            teardown: 'seed-firefox',
        },

        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
            teardown: 'seed-webkit',
        },

        {
            name: 'mobile',
            use: { viewport: { width: 375, height: 667 } },
            teardown: 'seed-mobile',
        },
        {
            name: 'tablet',
            use: { viewport: { width: 768, height: 1024 } },
            teardown: 'seed-tablet',
        },

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

    /* Start a fresh production server before each test run. */
    webServer: {
        command: process.env.CI ? 'npm run start:ci' : 'npm run start:playwright',
        url: BASE_URL,
        stdout: 'pipe',
        stderr: 'pipe',
        reuseExistingServer: false,
    },
});
