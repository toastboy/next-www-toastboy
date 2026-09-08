/**
 * .well-known resource E2E tests (RFC 8615)
 *
 * Guards against a future redirect refactor silently dropping the
 * change-password entry, or the security.txt static asset going missing.
 */
import { expect, test } from './utils/base';

test.describe('.well-known resources', () => {
    test('/.well-known/change-password redirects to the password page', async ({
        request,
    }) => {
        const response = await request.get('/.well-known/change-password', {
            maxRedirects: 0,
        });

        expect(response.status()).toBe(307);
        expect(response.headers().location).toBe('/footy/password');
    });

    test('/.well-known/security.txt is served as text/plain', async ({
        request,
    }) => {
        const response = await request.get('/.well-known/security.txt');

        expect(response.status()).toBe(200);
        expect(response.headers()['content-type']).toContain('text/plain');

        const body = await response.text();
        expect(body).toContain(
            'Contact: https://github.com/toastboy/next-www-toastboy/security/advisories/new',
        );
        expect(body).toMatch(/^Expires: .+$/m);
    });
});
