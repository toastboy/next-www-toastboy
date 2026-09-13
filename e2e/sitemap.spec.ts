/**
 * Sitemap / robots E2E tests.
 *
 * Guards that the two crawler-facing endpoints render, are served with the
 * right content type, and stay wired to each other.
 */
import { expect, test } from './utils/base';

test.describe('crawler endpoints', () => {
    test('/robots.txt is served as text and points at the sitemap', async ({
        request,
    }) => {
        const response = await request.get('/robots.txt');

        expect(response.status()).toBe(200);
        expect(response.headers()['content-type']).toContain('text/plain');

        const body = await response.text();
        expect(body).toMatch(/^User-Agent: \*/im);
        expect(body).toMatch(/^Disallow: \/footy\/admin\//im);
        expect(body).toMatch(/^Sitemap: https?:\/\/.+\/sitemap\.xml$/im);
    });

    test('/sitemap.xml is valid XML listing public pages', async ({
        request,
    }) => {
        const response = await request.get('/sitemap.xml');

        expect(response.status()).toBe(200);
        expect(response.headers()['content-type']).toContain('xml');

        const body = await response.text();
        expect(body).toContain(
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        );
        expect(body).toMatch(/<loc>https?:\/\/[^<]+\/footy<\/loc>/);
        expect(body).toMatch(
            /<loc>https?:\/\/[^<]+\/footy\/player\/\d+<\/loc>/,
        );
    });

    test('the sitemap excludes admin and auth-gated routes', async ({
        request,
    }) => {
        const body = await (await request.get('/sitemap.xml')).text();

        expect(body).not.toContain('/footy/admin/');
        expect(body).not.toContain('/footy/auth/');
        expect(body).not.toContain('/footy/profile');
    });
});
