import { expect, test } from '@/tests/playwright/fixtures';

import { asGuest, asUser } from './utils/auth';

test.describe('Mail active players', () => {
    test('denies access to guest users', async ({ page }) => {
        await asGuest(page, '/footy/mailout');

        await expect(page.locator('[data-testid="must-be-logged-in"]')).toBeVisible();
    });

    test('mail active players', async ({ page }) => {
        const subject = 'Test missive';
        const body = 'This is a test of the emergency broadcast system.';

        await asUser(page, '/footy/mailout');

        await expect(page.locator('[data-testid="must-be-logged-in"]')).not.toBeVisible();

        await expect(page).toHaveURL(/\/footy\/players/);

        await page.getByLabel('Select All').click();
        await page.getByRole('button', { name: 'Send Email...' }).click();

        await page.getByLabel('Subject').fill(subject);
        await page.locator('[contenteditable="true"]').fill(body);
        await page.getByRole('button', { name: 'Send Mail' }).click();

        // Check Mailpit for the email, then delete it

        const response = await page.goto('http://localhost:8025/');
        await page.waitForLoadState('networkidle');
        expect(response?.ok()).toBeTruthy();

        await expect(page.getByText(subject).first()).toBeVisible();
        await expect(page.getByText(body).first()).toBeVisible();

        await page.getByRole('button', { name: 'Delete all' }).click();
        await page.locator('button.btn.btn-danger[data-bs-dismiss="modal"]', { hasText: 'Delete' }).waitFor({ state: 'visible' });
        await page.locator('button.btn.btn-danger[data-bs-dismiss="modal"]', { hasText: 'Delete' }).click();
    });
});
