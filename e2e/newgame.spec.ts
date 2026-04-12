import { expect, test } from '@playwright/test';

import { asAdmin, asGuest, asUser } from './utils/auth';
import { deleteAllMessages, getMessageDetail, waitForMessage } from './utils/mailpit';

test.describe('New game flow', () => {
    test('denies access to guest users', async ({ page }) => {
        await asGuest(page, '/footy/admin/newgame');

        await expect(page.locator('[data-testid="must-be-admin"]')).toBeVisible();
    });

    test('denies access to regular users', async ({ page }) => {
        await asUser(page, '/footy/admin/newgame');

        await expect(page.locator('[data-testid="must-be-admin"]')).toBeVisible();
    });

    test('allows admins to send invitations and players can respond', async ({ page, request }) => {
        const customMessage = `Playwright invitation ${Date.now()}`;
        const responseComment = `Playwright response ${Date.now()}`;

        await asAdmin(page, '/footy/admin/newgame');

        await expect(page.locator('[data-testid="must-be-admin"]')).not.toBeVisible();
        await expect(page.getByRole('heading', { name: /New game/i })).toBeVisible();

        await page.getByLabel(/Override time check/i).check();
        await page.getByLabel(/Custom message/i).fill(customMessage);
        await page.getByRole('button', { name: 'Send invitations' }).click();

        await expect(page.getByText('Invitations ready')).toBeVisible({ timeout: 15000 });
        await expect(page.getByText('Invitations can be sent now.')).toBeVisible({ timeout: 15000 });

        const message = await waitForMessage(request, 'Toastboy FC invitation');
        expect(message, 'Expected invitation email in Mailpit').toBeTruthy();

        const detail = await getMessageDetail(request, message!.ID);
        const html = detail.HTML ?? '';
        expect(html).toContain(customMessage);

        const linkMatch = /href="([^"]*footy\/response[^"]*)"/i.exec(html);
        const invitationLink = linkMatch?.[1];
        expect(invitationLink).toBeTruthy();

        await page.goto(invitationLink ?? '');
        await page.waitForLoadState('networkidle');

        await expect(page.getByLabel('Response')).toBeVisible();
        await page.getByLabel('Response').selectOption('Yes');
        await page.getByLabel('Goalie').check();
        await page.getByLabel('Optional comment/excuse').fill(responseComment);
        await page.getByRole('button', { name: 'Done' }).click();

        await expect(page.getByText('Response saved')).toBeVisible({ timeout: 15000 });
        await expect(page.getByText(responseComment)).toBeVisible({ timeout: 15000 });

        await deleteAllMessages(request);
    });
});
