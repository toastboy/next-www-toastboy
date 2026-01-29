import { expect, test } from '@playwright/test';

import { asAdmin, asGuest, asUser } from './utils/auth';

test.describe('Auth Mocking System', () => {
    test('should show different content for different auth states', async ({ page }) => {
        // Test as guest (no auth)
        await asGuest(page);
        await page.goto('/footy/admin/users');
        await expect(page.locator('[data-testid="loading"]')).not.toBeVisible();

        // Should be redirected or show login form
        await expect(page.getByText('You must be logged in')).toBeVisible();

        // Test as regular user
        await asUser(page);
        await page.goto('/footy/admin/users');
        await expect(page.locator('[data-testid="loading"]')).not.toBeVisible();

        // Regular users should not access admin pages
        await expect(page.getByText('You must be logged in as an administrator')).toBeVisible();

        // Test as admin
        await asAdmin(page);
        await page.goto('/footy/admin/users');
        await expect(page.locator('[data-testid="loading"]')).not.toBeVisible();

        // Admin should see the users table
        await expect(page.locator('table')).toBeVisible();
    });

    test('should allow switching between auth states', async ({ page }) => {
        // Start as guest
        await asGuest(page);
        await page.goto('/footy/profile');
        await expect(page.getByText('You must be logged in')).toBeVisible();

        // Switch to user
        await asUser(page);
        await page.reload();
        // Should now have access to profile page
        // (assuming profile is accessible to regular users)

        // Switch to admin
        await asAdmin(page);
        await page.goto('/footy/admin/users');
        await expect(page.locator('table')).toBeVisible();

        // Switch back to guest
        await asGuest(page);
        await page.reload();
        await expect(page.getByText('You must be logged in')).toBeVisible();
    });
});
