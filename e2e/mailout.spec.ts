import { expect, test } from '@playwright/test';

import { asGuest, asUser, mustBeLoggedIn } from './utils/auth';
import { deleteAllMessages, getMessageDetail, waitForMessage } from './utils/mailpit';

test.describe('Mail active players', () => {
    test('denies access to guest users', async ({ page }) => {
        await asGuest(page, '/footy/mailout');

        await mustBeLoggedIn(page);
    });

    test('mail active players', async ({ page, request }) => {
        const subject = 'Test missive';
        const body = 'This is a test of the emergency broadcast system.';

        await asUser(page, '/footy/mailout');

        await expect(page).toHaveURL(/\/footy\/players/);
        await expect(page.getByRole('table').locator('tbody tr').first()).toBeVisible();

        await expect(page.getByRole('checkbox', { name: 'Select All' })).toBeVisible();
        await page.getByRole('checkbox', { name: 'Select All' }).click();
        await expect(page.getByRole('button', { name: /send email/i })).toBeEnabled();
        await page.getByRole('button', { name: /send email/i }).click();

        await page.getByRole('textbox', { name: 'Subject' }).fill(subject);
        const bodyEditor = page.locator('.ProseMirror');
        await bodyEditor.click();
        await bodyEditor.pressSequentially(body);
        await page.getByRole('button', { name: 'Send Mail' }).click();
        await expect(page.getByText('Email sent successfully')).toBeVisible();

        const message = await waitForMessage(request, subject);
        expect(message, `Expected email with subject "${subject}" in Mailpit`).toBeTruthy();

        const detail = await getMessageDetail(request, message!.ID);
        expect(detail.Text).toContain(body);

        await deleteAllMessages(request);
    });
});
