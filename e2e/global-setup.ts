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
 */
export default function globalSetup() {
    console.log('⚙️  Seeding test database...');
    if (process.env.CI) {
        execSync('npm run seed:ci', { stdio: 'inherit' });
    } else {
        execSync('npm run seed:playwright', { stdio: 'inherit' });
    }
    console.log('✅ Test database ready');
}
