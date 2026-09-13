import type { MetadataRoute } from 'next';
import { TableNameSchema } from 'prisma/zod/schemas';

import { getPublicBaseUrl } from '@/lib/urls';
import gameDayService from '@/services/GameDay';
import playerService from '@/services/Player';

/** Regenerate the sitemap at most hourly rather than on every request. */
export const revalidate = 3600;

/**
 * Public, indexable pages that always exist, as paths relative to the site
 * root. Auth-gated (`/footy/players`, `/footy/profile`, …) and admin
 * (`/footy/admin/**`) routes are deliberately omitted — see
 * `src/app/robots.ts`.
 */
const STATIC_PATHS = [
    '',
    '/footy',
    '/footy/game',
    '/footy/games',
    '/footy/results',
    '/footy/fixtures',
    '/footy/tables',
    '/footy/winners',
    '/footy/turnout',
    '/footy/rules',
    '/footy/info',
    '/footy/books',
    '/footy/curse',
    '/footy/familytree',
    '/footy/countrymap',
    '/footy/docs',
    '/footy/docs/privacy',
    '/footy/docs/migration',
] as const;

/**
 * Serves `/sitemap.xml`.
 *
 * Combines the fixed public pages ({@link STATIC_PATHS}) with the
 * data-driven ones: one entry per player, per game day, per league table,
 * and per year that has games. See CLAUDE.md → "Web standards &
 * `.well-known`".
 *
 * @returns The sitemap entries for Next.js to render.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = getPublicBaseUrl();
    // Resolve every path against the base with the URL constructor so a stray
    // trailing slash on the base or a missing leading slash on the path can't
    // produce a malformed `//` or concatenated URL.
    const url = (path: string) => new URL(path || '/', baseUrl).toString();

    const [playerIds, gameDays, years] = await Promise.all([
        playerService.getAllIds(),
        gameDayService.getAll(),
        gameDayService.getAllYears({ mostRecentFirst: true }),
    ]);

    const entries: MetadataRoute.Sitemap = [
        ...STATIC_PATHS.map((path) => ({ url: url(path) })),
        ...playerIds.map((id) => ({ url: url(`/footy/player/${id}`) })),
        ...gameDays.map((gameDay) => ({
            url: url(`/footy/game/${gameDay.id}`),
        })),
        ...TableNameSchema.options.map((table) => ({
            url: url(`/footy/table/${table}`),
        })),
        ...years.flatMap((year) => [
            { url: url(`/footy/results/${year}`) },
            { url: url(`/footy/fixtures/${year}`) },
            { url: url(`/footy/winners/${year}`) },
        ]),
    ];

    // Guarantee the uniqueness the callers assume — a duplicate could
    // otherwise slip in from a repeated year, an overlapping id space, or a
    // later edit to STATIC_PATHS.
    return [...new Map(entries.map((entry) => [entry.url, entry])).values()];
}
