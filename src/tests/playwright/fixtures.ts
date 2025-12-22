import { test as base } from '@playwright/test';

const APP_HOST = '127.0.0.1';

type LoggedError =
    | { type: 'console'; message: string }
    | { type: 'pageerror'; message: string }
    | { type: 'response'; message: string }
    | { type: 'requestfailed'; message: string };

function isAppUrl(url: string): boolean {
    try {
        const host = new URL(url).hostname;
        return host === APP_HOST;
    } catch {
        return false;
    }
}

function shouldIgnoreUrl(url: string): boolean {
    if (url.includes('/monitoring')) return true;
    if (url.includes('/__nextjs_font/')) return true;
    if (url.includes('/__nextjs_original-stack-frames')) return true;
    if (url.includes('/api/auth/get-session')) return true;
    if (url.includes('_rsc=')) return true;
    return false;
}

export const test = base.extend({
    page: async ({ page }, withPage, testInfo) => {
        const errors: LoggedError[] = [];

        page.on('pageerror', (error) => {
            const msg = error.message;
            if (msg.includes('/__nextjs_original-stack-frames')) {
                return;
            }
            if (msg.includes("Performance': 'RootPage' cannot have a negative time stamp")) {
                return;
            }
            errors.push({ type: 'pageerror', message: msg });
        });

        page.on('console', (message) => {
            if (message.type() === 'error') {
                errors.push({ type: 'console', message: message.text() });
            }
        });

        page.on('requestfailed', (request) => {
            const url = request.url();
            if (!isAppUrl(url)) return;
            if (shouldIgnoreUrl(url)) return;

            const failure = request.failure();
            const reason = failure?.errorText ?? 'request failed';

            if (request.isNavigationRequest() && /aborted|cancelled|NS_ERROR_FAILURE|NS_BINDING_ABORTED/i.test(reason)) {
                return;
            }

            if (request.resourceType() === 'image' && /aborted|cancelled/i.test(reason)) {
                return;
            }

            errors.push({ type: 'requestfailed', message: `${reason}: ${url}` });
        });

        page.on('response', (response) => {
            if (!isAppUrl(response.url())) {
                return;
            }

            const status = response.status();
            if (status >= 500) {
                errors.push({ type: 'response', message: `HTTP ${status} for ${response.url()}` });
            }
        });

        await withPage(page);

        if (errors.length > 0 && testInfo.status === 'passed') {
            const detail = errors.map((entry) => `[${entry.type}] ${entry.message}`).join('\n');
            throw new Error(`Detected browser errors:\n${detail}`);
        }
    },
});

export { expect } from '@playwright/test';
export type { Page } from '@playwright/test';

