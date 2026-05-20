import { expect,test as base } from '@playwright/test';

/**
 * Extended Playwright test that stubs out the SSE event stream on every test.
 *
 * AutoRefresh components hold open a connection to /api/events. Without this
 * stub, a broadcast from a parallel test (e.g. createPlayer broadcasting
 * FootyChannel.Players) triggers router.refresh() on any open page that
 * subscribes to that channel, resetting client-side state mid-test.
 *
 * Aborting the route means EventSource never receives an 'update' event, so
 * router.refresh() is never called. We are deliberately not testing the SSE
 * path through Playwright; unit tests cover that layer instead.
 */
export const test = base.extend({
    page: async ({ page }, use) => {
        await page.route('/api/events*', (route) => route.abort());
        await use(page);
    },
});

export { expect };
export type { Locator, Page } from '@playwright/test';
