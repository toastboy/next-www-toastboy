import { expect, test } from '@playwright/test';
import { asGuest, asUser } from './utils/auth';

test.describe('Mail active players', () => {
    test('denies access to guest users', async ({ page }) => {
        await asGuest(page, '/footy/mailout');

        await expect(page.locator('[data-testid="must-be-logged-in"]')).toBeVisible();
    });

    test('denies access to regular users', async ({ page }) => {
        await asUser(page, '/footy/mailout');

        await expect(page.locator('[data-testid="must-be-logged-in"]')).toBeVisible();
    });
});

test('mail active players', async ({ page }) => {
    const subject = 'Test missive';
    const body = 'This is a test of the emergency broadcast system.';

    await page.goto('/footy/mailout');
    await expect(page.locator('[data-testid="loading"]')).not.toBeVisible();

    await expect(page.locator('[data-testid="must-be-logged-in"]')).not.toBeVisible();

    await expect(page).toHaveURL(/\/footy\/players/);

    await page.getByLabel('Select All').click();
    await page.getByRole('button', { name: 'Send Email...' }).click();

    await page.getByLabel('Subject').fill(subject);
    await page.locator('[contenteditable="true"]').fill(body);
    await page.getByRole('button', { name: 'Send Mail' }).click();

    // Check Mailpit for the email, then delete it

    const response = await page.goto('http://localhost:8025/');
    expect(response?.ok()).toBeTruthy();

    expect(await page.getByText(subject).count()).toBeGreaterThanOrEqual(1);
    expect(await page.getByText(body).count()).toBeGreaterThanOrEqual(1);

    await page.getByRole('button', { name: 'Delete all' }).click();
    await page.locator('button.btn.btn-danger[data-bs-dismiss="modal"]', { hasText: 'Delete' }).waitFor({ state: 'visible' });
    await page.locator('button.btn.btn-danger[data-bs-dismiss="modal"]', { hasText: 'Delete' }).click();
});
