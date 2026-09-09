import type { MetadataRoute } from 'next';

import { getPublicBaseUrl } from '@/lib/urls';

/**
 * Serves `/robots.txt`.
 *
 * Allows crawling of the public site, disallows the auth-gated and admin
 * areas plus the API and Sentry tunnel, and points crawlers at the sitemap.
 * The `disallow` list is kept in step with the exclusions in
 * `src/app/sitemap.ts`. See CLAUDE.md → "Web standards & `.well-known`".
 *
 * @returns The robots rules for Next.js to render.
 */
export default function robots(): MetadataRoute.Robots {
    const baseUrl = getPublicBaseUrl();

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/api/',
                '/monitoring',
                '/footy/admin/',
                '/footy/auth/',
                '/footy/players',
                '/footy/profile',
                '/footy/password',
                '/footy/deleteaccount',
                '/footy/downloadmydata',
                '/footy/forgottenpassword',
                '/footy/response/',
            ],
        },
        sitemap: new URL('/sitemap.xml', baseUrl).toString(),
        host: baseUrl,
    };
}
