import { Page } from '@playwright/test';

export type MockAuthState = 'none' | 'user' | 'admin';

/**
 * Sets up authentication state for Playwright tests
 * @param page The Playwright page object
 * @param authState The desired authentication state
 */
export async function setAuthState(page: Page, authState: MockAuthState): Promise<void> {
    await page.addInitScript((state) => {
        // Mark that we're in a Playwright test
        (window as unknown as Record<string, unknown>).__PLAYWRIGHT_TEST__ = true;
        // Set the auth state
        (window as unknown as Record<string, unknown>).__MOCK_AUTH_STATE__ = state;
    }, authState);
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
export async function asUser(page: Page, uri?: string): Promise<void> {
    await setAuthState(page, 'user');
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
export async function asAdmin(page: Page, uri?: string): Promise<void> {
    await setAuthState(page, 'admin');
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
        return (window as unknown as Record<string, unknown>).__MOCK_AUTH_STATE__ as MockAuthState;
    });

    return authState || 'none';
}
