import { expect, test } from '@playwright/test';
import { asAdmin, asGuest, asUser } from './utils/auth';

test.describe('Money admin page', () => {
    test('denies access to guest users', async ({ page }) => {
        await asGuest(page, '/footy/money');

        await expect(page.locator('[data-testid="must-be-admin"]')).toBeVisible();
    });

    test('denies access to regular users', async ({ page }) => {
        await asUser(page, '/footy/money');

        await expect(page.locator('[data-testid="must-be-admin"]')).toBeVisible();
    });

    test('allows access to admin users and shows money admin interface', async ({ page }) => {
        await asAdmin(page, '/footy/money');

        await expect(page.locator('[data-testid="must-be-admin"]')).not.toBeVisible();

        // TODO: Add checks for the money admin interface elements
        await expect(page.locator('[data-testid="not-implemented"]')).toBeVisible();
    });
});
