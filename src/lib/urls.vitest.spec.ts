import { afterEach, describe, expect, it, vi } from 'vitest';

import { getPublicBaseUrl } from '@/lib/urls';

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
        vi.stubGlobal('window', { location: { origin: 'https://browser.example.com' } });
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
