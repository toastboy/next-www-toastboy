import type { Page, Request } from '@playwright/test';
import { expect, test as baseTest } from '@playwright/test';

export { expect };
export type { Page };

const parseHost = (url: string): string | null => {
    try {
        return new URL(url).host;
    } catch {
        return null;
    }
};

/**
 * Extended Playwright test fixture. Wraps every test's `page` with listeners
 * that log JS runtime errors and failed same-origin requests to the console,
 * making asset-loading or hydration failures visible in test output. The
 * request filter is derived from the configured `baseURL` (host + port), so
 * cross-origin noise (e.g. Google Maps) is suppressed regardless of which host
 * the tests run against.
 *
 * Import `test` and `expect` from here instead of `@playwright/test`.
 */
export const test = baseTest.extend({
    page: async ({ page, baseURL }, use) => {
        const allowedHost = baseURL ? parseHost(baseURL) : null;
        const onPageError = (err: Error) =>
            console.error('Page JS error:', err);
        const onRequestFailed = (req: Request) => {
            const errorText = req.failure()?.errorText ?? '';
            // Navigation-initiated cancellations are expected (e.g. SSE connections
            // dropped on page change) and vary by browser:
            // Chromium: net::ERR_ABORTED, Firefox: NS_BINDING_ABORTED, WebKit: Load request cancelled
            if (/cancel|ABORTED/i.test(errorText)) return;
            const reqHost = parseHost(req.url());
            if (!allowedHost || !reqHost || reqHost === allowedHost) {
                console.error('Request failed:', req.url(), errorText);
            }
        };
        page.on('pageerror', onPageError);
        page.on('requestfailed', onRequestFailed);
        try {
            await use(page);
        } finally {
            page.off('pageerror', onPageError);
            page.off('requestfailed', onRequestFailed);
        }
    },
});

/**
 * Call at the top of a test body to make it **CI-only**. Locally the test is
 * skipped so `npx playwright test` stays fast for quick checks; run it on
 * demand with `PLAYWRIGHT_RUN_SLOW=1`. Use for the handful of genuinely
 * expensive tests (e.g. the full-site crawl) whose coverage doesn't need to
 * gate every local iteration.
 */
export const ciOnly = (): void => {
    test.skip(
        !process.env.CI && process.env.PLAYWRIGHT_RUN_SLOW !== '1',
        'CI-only (slow); run locally with PLAYWRIGHT_RUN_SLOW=1',
    );
};
