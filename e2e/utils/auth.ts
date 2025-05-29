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
 * Helper function to test functionality as a non-logged-in user
 */
export async function asGuest(page: Page): Promise<void> {
    await setAuthState(page, 'none');
}

/**
 * Helper function to test functionality as a regular user
 */
export async function asUser(page: Page): Promise<void> {
    await setAuthState(page, 'user');
}

/**
 * Helper function to test functionality as an admin
 */
export async function asAdmin(page: Page): Promise<void> {
    await setAuthState(page, 'admin');
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
