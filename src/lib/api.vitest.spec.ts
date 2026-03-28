import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/auth.server', () => ({
    getUserRole: vi.fn(() => Promise.resolve('none')),
}));

vi.mock('@/lib/urls', () => ({
    getPublicBaseUrl: () => 'https://toastboy.co.uk',
}));

import { buildURLWithParams } from '@/lib/api';

describe('buildURLWithParams', () => {
    it('builds a URL with a relative path and params', () => {
        const url = buildURLWithParams('/footy/response', {
            token: 'abc',
            error: 'Something failed',
        });

        expect(url.origin).toBe('https://toastboy.co.uk');
        expect(url.pathname).toBe('/footy/response');
        expect(url.searchParams.get('token')).toBe('abc');
        expect(url.searchParams.get('error')).toBe('Something failed');
    });

    it('builds a URL with root path and no params', () => {
        const url = buildURLWithParams('/', {});

        expect(url.origin).toBe('https://toastboy.co.uk');
        expect(url.pathname).toBe('/');
    });

    it('prevents open redirect with absolute external URL', () => {
        const url = buildURLWithParams('https://evil.com/steal-cookies', {
            token: 'abc',
        });

        expect(url.origin).toBe('https://toastboy.co.uk');
        expect(url.pathname).toBe('/');
        expect(url.searchParams.get('token')).toBe('abc');
    });

    it('prevents open redirect with protocol-relative URL', () => {
        const url = buildURLWithParams('//evil.com/phish', {});

        expect(url.origin).toBe('https://toastboy.co.uk');
        expect(url.pathname).toBe('/');
    });

    it('allows same-origin absolute URL', () => {
        const url = buildURLWithParams('https://toastboy.co.uk/footy/profile', {
            success: 'true',
        });

        expect(url.origin).toBe('https://toastboy.co.uk');
        expect(url.pathname).toBe('/footy/profile');
        expect(url.searchParams.get('success')).toBe('true');
    });

    it('preserves query params from the base URI', () => {
        const url = buildURLWithParams('/footy/auth?existing=yes', {
            added: 'param',
        });

        expect(url.searchParams.get('existing')).toBe('yes');
        expect(url.searchParams.get('added')).toBe('param');
    });
});
