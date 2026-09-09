import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { LinkChecker, LinkState } from 'linkinator';

/**
 * Cookie that puts the mock-auth layer into admin mode (see
 * `getMockAuthState` in `src/lib/auth.server.ts`). The target server must be
 * running with `PLAYWRIGHT_TEST=true` (set by `npm run start:ci`) for it to
 * be honoured — in production the cookie is ignored.
 */
const ADMIN_COOKIE = 'mock-auth-state=admin';

/** Default report location, matching the v1 linkinator CLI output path. */
const DEFAULT_REPORT_PATH = 'linkinator-report.json';

/** The subset of `linkinator.config.json` this crawl reuses. */
interface LinkinatorFileConfig {
    recurse?: boolean;
    skip?: string[];
    retry?: boolean;
    concurrency?: number;
    timeout?: number;
}

/**
 * Reads the shared crawl settings from `linkinator.config.json` so the
 * authenticated crawl uses the same skip list, retry policy and concurrency
 * as the v1 CLI crawl — one source of truth for both.
 *
 * @param path - Path to the config file.
 * @returns The parsed config.
 */
export function readLinkinatorConfig(
    path = 'linkinator.config.json',
): LinkinatorFileConfig {
    return JSON.parse(readFileSync(path, 'utf8')) as LinkinatorFileConfig;
}

/** Options for {@link runLinkCheck}. */
export interface RunLinkCheckOptions {
    /** Origin to crawl. Defaults to `SITE_URL`, then `http://127.0.0.1:3000`. */
    baseUrl?: string;
    /** Path to `linkinator.config.json`. */
    configPath?: string;
    /** Where to write the JSON report. */
    reportPath?: string;
}

/** Origin to crawl: explicit arg, else `SITE_URL`, else the local CI server. */
function resolveBaseUrl(explicit?: string): string {
    const trimmed = (explicit ?? process.env.SITE_URL ?? '')
        .trim()
        .replace(/\/+$/, '');
    return trimmed.length > 0 ? trimmed : 'http://127.0.0.1:3000';
}

/**
 * Crawls the site as a mock admin, following every internal link reachable
 * from `/` and `/footy` — including the `src/app/footy/**` admin surface that
 * an unauthenticated crawl only ever sees a redirect for.
 *
 * Writes a JSON report in the same shape as the v1 linkinator CLI
 * (`--format json`), so `.github/workflows/link-check.yml` can summarise it
 * unchanged.
 *
 * @param options - See {@link RunLinkCheckOptions}.
 * @returns The number of broken internal links found.
 */
export async function runLinkCheck({
    baseUrl,
    configPath = 'linkinator.config.json',
    reportPath = DEFAULT_REPORT_PATH,
}: RunLinkCheckOptions = {}): Promise<number> {
    const origin = resolveBaseUrl(baseUrl);
    const config = readLinkinatorConfig(configPath);
    const checker = new LinkChecker();

    checker.on('link', (link) => {
        const status = String(link.status ?? '—');
        if (link.state === LinkState.BROKEN) {
            console.error(
                `[${status}] BROKEN ${link.url} (from ${String(link.parent ?? '?')})`,
            );
        } else {
            console.log(`[${status}] ${link.url}`);
        }
    });

    const result = await checker.check({
        path: [`${origin}/`, `${origin}/footy`],
        recurse: config.recurse ?? true,
        linksToSkip: config.skip ?? [],
        retry: config.retry ?? true,
        concurrency: config.concurrency ?? 20,
        timeout: config.timeout ?? 10_000,
        headers: { Cookie: ADMIN_COOKIE },
    });

    writeFileSync(reportPath, JSON.stringify(result, null, 2));

    const brokenCount = result.links.filter(
        (link) => link.state === LinkState.BROKEN,
    ).length;
    console.log(
        `\n${result.links.length} links checked, ${brokenCount} broken.`,
    );
    return brokenCount;
}

/* c8 ignore start -- entrypoint wiring; the crawl itself is exercised by CI */
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    void (async () => {
        try {
            const brokenCount = await runLinkCheck();
            process.exitCode = brokenCount > 0 ? 1 : 0;
        } catch (error) {
            console.error(error);
            process.exitCode = 1;
        }
    })();
}
/* c8 ignore stop */
