import { expect, test } from '@playwright/test';
import { asAdmin, asGuest, asUser } from './utils/auth';

test.describe('Money admin page', () => {
    test('denies access to guest users', async ({ page }) => {
        await asGuest(page);
        await page.goto('/footy/money');
        await page.waitForLoadState('networkidle');
        await expect(page.locator('[data-testid="loading"]')).not.toBeVisible();

        expect(await page.getByText('You must be logged in as an administrator to use this page.').count()).toEqual(1);
    });

    test('denies access to regular users', async ({ page }) => {
        await asUser(page);
        await page.goto('/footy/money');
        await page.waitForLoadState('networkidle');
        await expect(page.locator('[data-testid="loading"]')).not.toBeVisible();

        expect(await page.getByText('You must be logged in as an administrator to use this page.').count()).toEqual(1);
    });

    test('allows access to admin users and shows money table', async ({ page }) => {
        await asAdmin(page);
        await page.goto('/footy/money');
        await page.waitForLoadState('networkidle');
        await expect(page.locator('[data-testid="loading"]')).not.toBeVisible();

        expect(await page.getByText('(Not yet implemented)').count()).toEqual(1);
    });
});
