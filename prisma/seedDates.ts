/**
 * Returns the next Friday at 19:00 from the given date (the following week's
 * Friday if `from` already falls on a Friday after 19:00).
 *
 * Shared between prisma/seed.ci.ts (which bakes this date into the
 * publish-seeded-db-image.yml image) and prisma/refresh-upcoming-gameday.ts
 * (which re-computes it at Playwright run time, since the baked-in date goes
 * stale once real time passes it).
 */
export function nextFriday(from: Date): Date {
    const d = new Date(from);
    const daysUntilFriday = ((5 - d.getDay()) + 7) % 7 || 7;
    d.setDate(d.getDate() + daysUntilFriday);
    d.setHours(19, 0, 0, 0);
    return d;
}
