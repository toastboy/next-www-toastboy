import { asAdmin } from './utils/auth';
import { expect, test } from './utils/base';

// A full-site crawl is many page loads; repeating it once per browser project
// (chromium/firefox/webkit/mobile/tablet) would 5x the runtime for no extra
// coverage, since the failures this test looks for (Next.js error/not-found
// boundaries) render identically regardless of browser engine.
const CHROMIUM_ONLY = 'full-site crawl is expensive to repeat per-browser; chromium coverage is representative';

// Not a normal operating limit - the crawl stops on its own once the queue
// empties, well short of this in the current seed (~150-200 pages). This
// exists purely to stop a genuinely runaway crawl (e.g. a link generator bug
// producing unbounded URLs) from hanging forever. It must stay well above
// realistic site scale - production already has 250+ players and 1000+
// games, and games accumulate weekly - or it starts silently truncating
// real coverage instead of catching regressions. Hitting it is treated as a
// failure below rather than a silent partial pass.
const MAX_PAGES = 5000;

/**
 * Resolves an anchor's href to a same-origin pathname, or null if it's
 * external, a fragment, or a non-navigational scheme (mailto:, tel:, etc.).
 * Query strings are stripped deliberately: pages like year-filtered tables
 * would otherwise combinatorially explode the crawl (one variant per year per
 * table), and the query-string dimension isn't what this crawl is checking -
 * it's checking that every distinct *page* (route + entity id) renders.
 */
const toSameOriginPathname = (href: string, origin: string): string | null => {
    if (/^(#|mailto:|tel:|javascript:)/i.test(href)) return null;
    let url: URL;
    try {
        url = new URL(href, origin);
    } catch {
        return null;
    }
    if (url.origin !== origin || url.pathname.startsWith('/api/')) return null;
    return url.pathname;
};

test('crawl every reachable internal page and verify it renders without error', async ({ page, baseURL }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', CHROMIUM_ONLY);
    test.setTimeout(5 * 60 * 1000);

    const origin = new URL(baseURL!).origin;
    // Admin auth surfaces the most links (admin pages, plus everything a
    // guest/user would see) so the crawl gets maximum reachable coverage.
    await asAdmin(page);

    const visited = new Set<string>();
    // Mirrors what's in `queue`, so membership checks below are O(1) instead
    // of an O(n) Array.includes scan on every discovered link.
    const enqueued = new Set<string>(['/']);
    const queue: string[] = ['/'];
    const failures: string[] = [];

    while (queue.length > 0 && visited.size < MAX_PAGES) {
        const path = queue.shift();
        if (path === undefined) continue;
        enqueued.delete(path);
        if (visited.has(path)) continue;
        visited.add(path);

        let response;
        try {
            // Many pages hold a long-lived AutoRefresh SSE connection open
            // indefinitely, so 'networkidle' never resolves - wait for the
            // app's global Suspense fallback (src/app/loading.tsx) to clear
            // instead, which is a direct signal that streamed content settled.
            response = await page.goto(path);
            await page.getByTestId('loading').waitFor({ state: 'detached', timeout: 15000 }).catch(() => undefined);
        } catch (err) {
            failures.push(`${path} -> navigation failed: ${(err as Error).message}`);
            continue;
        }

        // Next.js streams a 200 even when a page later calls notFound() or
        // throws, once the shell has already flushed - so an ok() status
        // alone doesn't prove the page rendered successfully. Check the
        // rendered not-found/error boundaries too. (Not page.getByRole('alert')
        // - Next's built-in app-router-announcer live region also has
        // role="alert" and is present on every page, error or not.)
        const notFound = await page.getByRole('heading', { name: 'Page not found' })
            .isVisible().catch(() => false);
        const errorBoundary = await page.getByRole('button', { name: 'Try again' })
            .isVisible().catch(() => false);

        if (!response?.ok() || notFound || errorBoundary) {
            const reasons = [
                `status ${response?.status() ?? 'none'}`,
                notFound && 'not-found boundary rendered',
                errorBoundary && 'error boundary rendered',
            ].filter(Boolean).join(', ');
            failures.push(`${path} -> ${reasons}`);
            continue;
        }

        const hrefs = await page.locator('a:visible').evaluateAll(
            (els) => els.map((el) => el.getAttribute('href')).filter((h): h is string => !!h),
        );

        for (const href of hrefs) {
            const pathname = toSameOriginPathname(href, origin);
            if (pathname && !visited.has(pathname) && !enqueued.has(pathname)) {
                enqueued.add(pathname);
                queue.push(pathname);
            }
        }
    }

    if (queue.length > 0) {
        failures.push(
            `Crawl hit the MAX_PAGES safety valve (${MAX_PAGES}) with ${queue.length} page(s) still queued - ` +
            'coverage was truncated. Raise MAX_PAGES, or investigate whether a link is generating unbounded URLs.',
        );
    }

    expect(failures, `Broken pages found:\n${failures.join('\n')}`).toEqual([]);
});
