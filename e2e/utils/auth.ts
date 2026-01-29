import { Page } from '@playwright/test';

export type MockAuthState = 'none' | 'user' | 'admin';
const MOCK_AUTH_COOKIE = 'mock-auth-state';
const MOCK_AUTH_USER_COOKIE = 'mock-auth-user';

// Some parts of the app call back to the canonical base URL (localhost) while
// Playwright drives the app via 127.0.0.1. Seeding both hosts keeps the mock
// cookies available regardless of which host the request targets in CI.
const COOKIE_HOSTS = [
    'http://127.0.0.1:3000',
    'http://localhost:3000',
];

export interface MockAuthUser {
    name?: string | null;
    email?: string | null;
    playerId?: number | null;
}

/**
 * Sets up authentication state for Playwright tests
 * @param page The Playwright page object
 * @param authState The desired authentication state
 */
export async function setAuthState(
    page: Page,
    authState: MockAuthState,
    user?: MockAuthUser,
): Promise<void> {
    const cookies = COOKIE_HOSTS.flatMap((target) => {
        const url = new URL(target);
        const base = {
            path: '/',
            url: url.origin,
        } as const;

        const hostCookies = [{
            name: MOCK_AUTH_COOKIE,
            value: authState,
            ...base,
        }];

        if (user) {
            hostCookies.push({
                name: MOCK_AUTH_USER_COOKIE,
                value: encodeURIComponent(JSON.stringify(user)),
                ...base,
            });
        }

        return hostCookies;
    });

    await page.context().addCookies(cookies);
}

/**
 * Sets the authentication state of the given Playwright page to "guest" (no
 * authentication) and optionally navigates to the specified URI.
 *
 * @param page - The Playwright Page instance to modify.
 * @param uri - (Optional) The URI to navigate to after setting the auth state.
 * @returns A promise that resolves when the authentication state is set,
 *          navigation (if any) is complete, and the page has reached the
 *          'networkidle' load state.
 */
export async function asGuest(page: Page, uri?: string): Promise<void> {
    await setAuthState(page, 'none');
    if (uri) {
        await page.goto(uri);
    }
    await page.waitForLoadState('networkidle');
}

/**
 * Sets the authentication state of the given Playwright page to "user" and
 * optionally navigates to the specified URI.
 *
 * @param page - The Playwright Page instance to modify.
 * @param uri - (Optional) The URI to navigate to after setting the auth state.
 * @returns A promise that resolves when the authentication state is set,
 *          navigation (if any) is complete, and the page has reached the
 *          'networkidle' load state.
 */
export async function asUser(page: Page, uri?: string, user?: MockAuthUser): Promise<void> {
    await setAuthState(page, 'user', user);
    if (uri) {
        await page.goto(uri);
    }
    await page.waitForLoadState('networkidle');
}

/**
 * Sets the authentication state of the given Playwright page to "admin" and
 * optionally navigates to the specified URI.
 *
 * @param page - The Playwright Page instance to modify.
 * @param uri - (Optional) The URI to navigate to after setting the auth state.
 * @returns A promise that resolves when the authentication state is set,
 *          navigation (if any) is complete, and the page has reached the
 *          'networkidle' load state.
 */
export async function asAdmin(page: Page, uri?: string, user?: MockAuthUser): Promise<void> {
    await setAuthState(page, 'admin', user);
    if (uri) {
        await page.goto(uri);
    }
    await page.waitForLoadState('networkidle');
}

/**
 * Clear auth state (same as asGuest)
 */
export async function clearAuthState(page: Page): Promise<void> {
    await setAuthState(page, 'none');
}

/**
 * Get current auth state from the page
 */
export async function getAuthState(page: Page): Promise<MockAuthState> {
    const authState = await page.evaluate(() => {
        const cookieValue = document.cookie
            .split(';')
            .map((cookie) => cookie.trim())
            .find((cookie) => cookie.startsWith(`${MOCK_AUTH_COOKIE}=`));
        if (!cookieValue) return 'none';
        const value = decodeURIComponent(cookieValue.split('=').slice(1).join('='));
        return value === 'admin' || value === 'user' ? value : 'none';
    });

    return authState || 'none';
}
