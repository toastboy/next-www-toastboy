import { afterEach, describe, expect, it, vi } from 'vitest';

import {
    DEFAULT_REDIRECT_PATH,
    getPublicBaseUrl,
    getTrustedOrigins,
    isSafeRedirectPath,
    safeDecodeURIComponent,
    sanitizeRedirectPath,
} from '@/lib/urls';

describe('safeDecodeURIComponent', () => {
    it('decodes a valid percent-encoded string', () => {
        expect(safeDecodeURIComponent('alice%40example.com')).toBe(
            'alice@example.com',
        );
    });

    it('returns the input unchanged when it contains no percent-encoding', () => {
        expect(safeDecodeURIComponent('alice@example.com')).toBe(
            'alice@example.com',
        );
    });

    it('returns the input unchanged when percent-encoding is malformed', () => {
        expect(safeDecodeURIComponent('50%off@example.com')).toBe(
            '50%off@example.com',
        );
    });
});

describe('isSafeRedirectPath', () => {
    it.each([
        '/footy/profile',
        '/footy/admin/users?tab=1&q=a',
        '/footy/games#results',
        '/',
        '/a/b/c/(nested)/d',
        // Square brackets are legal in a path (e.g. encoded array params); the
        // internal allow-list regex must treat them as literals, not choke on
        // them, and must not throw when the module is evaluated.
        '/footy/report?ids[]=1&ids[]=2',
    ])('accepts the safe internal path %j', (value) => {
        expect(isSafeRedirectPath(value)).toBe(true);
    });

    it.each([
        ['absolute http URL', 'http://evil.example/steal'],
        ['absolute https URL', 'https://evil.example'],
        ['protocol-relative URL', '//evil.example'],
        ['scheme-relative with backslash', '/\\evil.example'],
        ['leading backslashes', '\\\\evil.example'],
        ['javascript: pseudo-URL', 'javascript:alert(1)'],
        ['data: URL', 'data:text/html,<script>1</script>'],
        ['bare word without leading slash', 'footy/profile'],
        ['embedded space', '/footy/ profile'],
        ['embedded tab', '/footy/\tprofile'],
        ['embedded newline', '/footy/\nprofile'],
        ['angle brackets', '/footy/<script>'],
        ['empty string', ''],
    ])('rejects %s', (_label, value) => {
        expect(isSafeRedirectPath(value)).toBe(false);
    });

    it('rejects null and undefined', () => {
        expect(isSafeRedirectPath(null)).toBe(false);
        expect(isSafeRedirectPath(undefined)).toBe(false);
    });
});

describe('sanitizeRedirectPath', () => {
    it('returns a safe internal path unchanged', () => {
        expect(sanitizeRedirectPath('/footy/games')).toBe('/footy/games');
    });

    it('falls back to the default when the value is unsafe', () => {
        expect(sanitizeRedirectPath('https://evil.example')).toBe(
            DEFAULT_REDIRECT_PATH,
        );
        expect(sanitizeRedirectPath('//evil.example')).toBe(
            DEFAULT_REDIRECT_PATH,
        );
        expect(sanitizeRedirectPath(undefined)).toBe(DEFAULT_REDIRECT_PATH);
    });

    it('uses a safe caller-supplied fallback when the value is unsafe', () => {
        expect(
            sanitizeRedirectPath('https://evil.example', '/footy/admin'),
        ).toBe('/footy/admin');
    });

    it('ignores an unsafe fallback and uses the default instead', () => {
        expect(
            sanitizeRedirectPath('https://evil.example', 'https://also.evil'),
        ).toBe(DEFAULT_REDIRECT_PATH);
    });
});

describe('getPublicBaseUrl', () => {
    afterEach(() => {
        vi.unstubAllEnvs();
        vi.unstubAllGlobals();
    });

    it('returns SITE_URL when set, stripping trailing slashes', () => {
        vi.stubEnv('SITE_URL', 'https://example.com/');
        expect(getPublicBaseUrl()).toBe('https://example.com');
    });

    it('falls back to NEXT_PUBLIC_SITE_URL when SITE_URL is absent', () => {
        vi.stubEnv('SITE_URL', '');
        vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://public.example.com/');
        expect(getPublicBaseUrl()).toBe('https://public.example.com');
    });

    it('falls back to BETTER_AUTH_URL when the first two are absent', () => {
        vi.stubEnv('SITE_URL', '');
        vi.stubEnv('NEXT_PUBLIC_SITE_URL', '');
        vi.stubEnv('BETTER_AUTH_URL', 'https://auth.example.com/');
        expect(getPublicBaseUrl()).toBe('https://auth.example.com');
    });

    it('returns window.location.origin when no env var is set and window is available', () => {
        vi.stubEnv('SITE_URL', '');
        vi.stubEnv('NEXT_PUBLIC_SITE_URL', '');
        vi.stubEnv('BETTER_AUTH_URL', '');
        vi.stubGlobal('window', {
            location: { origin: 'https://browser.example.com' },
        });
        expect(getPublicBaseUrl()).toBe('https://browser.example.com');
    });

    it('falls back to http://localhost:3000 when nothing is configured', () => {
        vi.stubEnv('SITE_URL', '');
        vi.stubEnv('NEXT_PUBLIC_SITE_URL', '');
        vi.stubEnv('BETTER_AUTH_URL', '');
        expect(getPublicBaseUrl()).toBe('http://localhost:3000');
    });

    it('strips multiple trailing slashes from env URLs', () => {
        vi.stubEnv('SITE_URL', 'https://example.com///');
        expect(getPublicBaseUrl()).toBe('https://example.com');
    });
});

describe('getTrustedOrigins', () => {
    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it('defaults to localhost:3000 when TRUSTED_ORIGINS is unset', () => {
        vi.stubEnv('TRUSTED_ORIGINS', '');
        expect(getTrustedOrigins()).toEqual(['http://localhost:3000']);
    });

    it('parses a single configured origin', () => {
        vi.stubEnv('TRUSTED_ORIGINS', 'https://next-www.toastboy.co.uk');
        expect(getTrustedOrigins()).toEqual([
            'https://next-www.toastboy.co.uk',
        ]);
    });

    it('parses multiple comma-separated origins, trimming whitespace', () => {
        vi.stubEnv(
            'TRUSTED_ORIGINS',
            ' https://next-www.toastboy.co.uk , https://www.toastboy.co.uk ',
        );
        expect(getTrustedOrigins()).toEqual([
            'https://next-www.toastboy.co.uk',
            'https://www.toastboy.co.uk',
        ]);
    });

    it('drops empty entries caused by trailing or repeated commas', () => {
        vi.stubEnv('TRUSTED_ORIGINS', 'https://next-www.toastboy.co.uk,,');
        expect(getTrustedOrigins()).toEqual([
            'https://next-www.toastboy.co.uk',
        ]);
    });
});
