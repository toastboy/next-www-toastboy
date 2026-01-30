import { expect, test } from '@playwright/test';

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

        await expect(page.getByTestId('players-table')).toHaveAttribute('data-row-count', /[1-9]/);

        await page.getByTestId('players-select-all').click();
        await expect(page.getByTestId('players-send-email')).toBeEnabled();
        await page.getByTestId('players-send-email').click();

        await page.getByTestId('send-email-subject').fill(subject);
        const bodyEditor = page.getByTestId('send-email-body');
        await bodyEditor.click();
        await bodyEditor.pressSequentially(body);
        await page.getByTestId('send-email-submit').click();
        await expect(page.getByText('Email sent successfully')).toBeVisible();

        // Check Mailpit for the email, then delete it

        const response = await page.goto('http://localhost:8025/');
        await page.waitForLoadState('networkidle');
        expect(response?.ok()).toBeTruthy();

        await expect(page.getByText(subject).first()).toBeVisible({ timeout: 30000 });
        await expect(page.getByText(body).first()).toBeVisible({ timeout: 30000 });

        await page.getByRole('button', { name: 'Delete all' }).click();
        await page.locator('button.btn.btn-danger[data-bs-dismiss="modal"]', { hasText: 'Delete' }).waitFor({ state: 'visible' });
        await page.locator('button.btn.btn-danger[data-bs-dismiss="modal"]', { hasText: 'Delete' }).click();
    });
});
