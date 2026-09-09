import { vi } from 'vitest';

vi.mock('@/lib/urls', () => ({
    getPublicBaseUrl: vi.fn(() => 'https://footy.example'),
}));

import robots from '@/app/robots';

describe('robots', () => {
    it('points crawlers at the sitemap and sets the host from the public base URL', () => {
        const result = robots();

        expect(result.sitemap).toBe('https://footy.example/sitemap.xml');
        expect(result.host).toBe('https://footy.example');
    });

    it('allows the site root for every user agent', () => {
        const { rules } = robots();

        expect(rules).not.toBeInstanceOf(Array);
        expect(rules).toMatchObject({ userAgent: '*', allow: '/' });
    });

    it('disallows the API, admin and auth-gated areas', () => {
        const { rules } = robots();

        if (Array.isArray(rules)) {
            throw new Error('expected a single rules object');
        }

        expect(rules.disallow).toEqual(
            expect.arrayContaining([
                '/api/',
                '/monitoring',
                '/footy/admin/',
                '/footy/auth/',
                '/footy/players',
                '/footy/profile',
                '/footy/password',
                '/footy/deleteaccount',
                '/footy/downloadmydata',
            ]),
        );
    });
});
