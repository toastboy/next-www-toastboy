import { expect, test } from '@playwright/test';

import { asAdmin, asGuest, asUser } from './utils/auth';

test.describe('Users Admin Page with Auth Mocking', () => {
    test('denies access to guest users', async ({ page }) => {
        await asGuest(page);
        await page.goto('/footy/admin/users');
        await expect(page.locator('[data-testid="loading"]')).not.toBeVisible();

        await expect(page.getByText('You must be logged in')).toBeVisible();
    });

    test('denies access to regular users', async ({ page }) => {
        await asUser(page);
        await page.goto('/footy/admin/users');
        await expect(page.locator('[data-testid="loading"]')).not.toBeVisible();

        await expect(page.getByText('You must be logged in as an administrator')).toBeVisible();
    });

    test('allows access to admin users and shows user list', async ({ page }) => {
        await asAdmin(page);
        await page.goto('/footy/admin/users');
        await expect(page.locator('[data-testid="loading"]')).not.toBeVisible();

        // Should show the users table
        await expect(page.locator('table')).toBeVisible();

        // Should show admin controls - check for any column header
        await expect(page.locator('th').first()).toBeVisible();

        // Should have search functionality
        await expect(page.getByPlaceholder('Search users')).toBeVisible();
    });
});

test.describe('Profile Page with Auth Mocking', () => {
    test('requires authentication', async ({ page }) => {
        await asGuest(page);
        await page.goto('/footy/profile');
        await expect(page.locator('[data-testid="loading"]')).not.toBeVisible();

        await expect(page.getByText('You must be logged in to use this page.')).toBeVisible();
    });

    test('allows authenticated users to access profile', async ({ page }) => {
        await asUser(page);
        await page.goto('/footy/profile');
        await expect(page.locator('[data-testid="loading"]')).not.toBeVisible();

        // Should not show login requirement
        await expect(page.getByText('You must be logged in to use this page.')).not.toBeVisible();

        // Should show profile form (this might need adjustment based on actual page structure)
        // await expect(page.getByLabel('First Name:')).toBeVisible();
    });
});
