import { expect, test } from '@playwright/test';

import { asAdmin, asGuest, asUser } from './utils/auth';

test.describe('Money admin page', () => {
    test('denies access to guest users', async ({ page }) => {
        await asGuest(page, '/footy/admin/money');
        await expect(page.locator('[data-testid="must-be-admin"]')).toBeVisible();
    });

    test('denies access to regular users', async ({ page }) => {
        await asUser(page, '/footy/admin/money');
        await expect(page.locator('[data-testid="must-be-admin"]')).toBeVisible();
    });

    test('allows access to admin users and shows money admin interface', async ({ page }) => {
        await asAdmin(page, '/footy/admin/money');
        await expect(page.locator('[data-testid="must-be-admin"]')).not.toBeVisible();

        // Check for the money admin interface elements
        await expect(page.getByRole('heading', { name: 'Unpaid Player Charges' })).toBeVisible();
        // Example: check for a Paid button (should be present for each player with debts)
        await expect(page.getByRole('button', { name: 'Paid' }).first()).toBeVisible();
        // Example: check for a player name from mock data (if seeded)
        // await expect(page.getByText('Alex Current')).toBeVisible();
    });
});
