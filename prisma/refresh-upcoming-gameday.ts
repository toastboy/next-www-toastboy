import 'dotenv/config';

import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from 'prisma/generated/client';
import { nextFriday } from 'prisma/seedDates';

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

/**
 * Re-dates the seeded "upcoming" game day to the next Friday from right now.
 *
 * playwright.yml skips the full reseed in CI (SKIP_DB_SEED) and instead pulls
 * a pre-built database image (see publish-seeded-db-image.yml) to save time.
 * That image is only rebuilt when prisma/schema.prisma or prisma/seed.ci.ts
 * change, so the "upcoming" game day's date - baked in at whatever moment the
 * image was last published - keeps drifting into the past as real time moves
 * on. Once it's no longer in the future, gameDayService.getUpcoming() finds
 * no game at all, and invitation-sending is skipped regardless of the
 * override flag. This runs once per Playwright invocation to keep that row
 * genuinely upcoming without paying for a full reseed.
 */
async function main() {
    // prisma/seed.ci.ts sets mailSent on every historical game day and leaves
    // it null only on the upcoming one - that's what distinguishes it here,
    // since by the time this runs its `date` may have drifted behind even
    // the most recent historical Friday.
    const upcoming = await prisma.gameDay.findFirst({
        where: { game: true, mailSent: null },
        orderBy: { date: 'desc' },
    });

    if (!upcoming) {
        console.log('  No upcoming game day (mailSent: null) found to refresh - skipping.');
        return;
    }

    const date = nextFriday(new Date());
    await prisma.gameDay.update({
        where: { id: upcoming.id },
        data: { date, year: date.getFullYear(), mailSent: null },
    });

    console.log(`  Refreshed upcoming game day ${upcoming.id} to ${date.toISOString()}`);
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(() => {
        void prisma.$disconnect();
    });
