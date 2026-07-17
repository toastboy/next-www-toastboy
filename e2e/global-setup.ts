import { execSync } from 'node:child_process';

/**
 * Runs once before any Playwright tests. Seeds the test database so every
 * test run starts from a known, deterministic state regardless of how
 * playwright is invoked (npx playwright test, CI, etc.).
 *
 * Schema sync (prisma db push) must happen BEFORE the web server starts to
 * avoid disrupting its connection pool. It is NOT done here:
 *   - Local: run `npm run setup:playwright` once after docker setup or schema
 *     changes, then `npm run build`.
 *   - CI: the workflow runs `prisma db push` and `npm run build` before tests.
 *
 * This function only inserts/replaces data, which is safe while the server
 * is running.
 *
 * When SKIP_DB_SEED is set, the full seed is skipped - used by CI when the
 * `db` container was started from a pre-seeded image (see
 * .github/workflows/publish-seeded-db-image.yml) rather than a bare
 * `mariadb:lts`, so the data is already there. `prisma db push` still runs as
 * a separate CI step regardless, so schema changes on a branch not yet
 * baked into that image are still applied correctly.
 *
 * That image is only rebuilt when prisma/schema.prisma or prisma/seed.ci.ts
 * change, so the single "upcoming" game day it bakes in goes stale as real
 * time passes it - once its date is in the past, gameDayService.getUpcoming()
 * finds no game at all and invitation-sending is skipped regardless of the
 * override flag. So even when the full seed is skipped, that one row's date
 * is still re-pointed at the next Friday from now.
 */
export default function globalSetup() {
    if (process.env.SKIP_DB_SEED) {
        console.log('⚙️  Refreshing upcoming game day on pre-seeded image...');
        if (process.env.CI) {
            execSync('npm run refresh:upcoming-gameday:ci', { stdio: 'inherit' });
        } else {
            execSync('npm run refresh:upcoming-gameday:playwright', { stdio: 'inherit' });
        }
        console.log('✅ Upcoming game day refreshed');
        return;
    }

    console.log('⚙️  Seeding test database...');
    if (process.env.CI) {
        execSync('npm run seed:ci', { stdio: 'inherit' });
    } else {
        execSync('npm run seed:playwright', { stdio: 'inherit' });
    }
    console.log('✅ Test database ready');
}
