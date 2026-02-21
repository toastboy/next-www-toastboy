import { expect, test } from '@playwright/test';

import { asAdmin, asGuest, asUser } from './utils/auth';

test.describe('drinkers admin page', () => {
    test('denies access to guest users', async ({ page }) => {
        await asGuest(page, '/footy/drinkers');

        await expect(page.locator('[data-testid="must-be-admin"]')).toBeVisible();
    });

    test('denies access to regular users', async ({ page }) => {
        await asUser(page, '/footy/drinkers');

        await expect(page.locator('[data-testid="must-be-admin"]')).toBeVisible();
    });

    test('allows access to admin users and shows drinkers admin interface', async ({ page }) => {
        await asAdmin(page, '/footy/drinkers');

        await expect(page.locator('[data-testid="must-be-admin"]')).not.toBeVisible();
        await expect(page).toHaveURL(/\/footy\/admin\/drinkers\/\d+$/);
        await expect(page.locator('[data-testid="drinkers-form"]')).toBeVisible();
        await expect(page.getByRole('heading', { name: /Game \d+ Drinkers/i })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Save drinkers' })).toBeVisible();
    });
});
