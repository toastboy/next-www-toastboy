import { expect, test } from '@playwright/test';

import { asAdmin, asGuest, asUser } from './utils/auth';

interface MailpitMessageSummary {
    ID: string;
    Subject: string;
}

interface MailpitMessagesResponse {
    messages?: MailpitMessageSummary[];
}

interface MailpitMessageDetail {
    HTML?: string;
}

test.describe('New game flow', () => {
    test('denies access to guest users', async ({ page }) => {
        await asGuest(page, '/footy/admin/newgame');

        await expect(page.locator('[data-testid="must-be-admin"]')).toBeVisible();
    });

    test('denies access to regular users', async ({ page }) => {
        await asUser(page, '/footy/admin/newgame');

        await expect(page.locator('[data-testid="must-be-admin"]')).toBeVisible();
    });

    test('allows admins to send invitations and players can respond', async ({ page }) => {
        const customMessage = `Playwright invitation ${Date.now()}`;
        const responseComment = `Playwright response ${Date.now()}`;
        const mailpitUrl = 'http://localhost:8025/';

        await asAdmin(page, '/footy/admin/newgame');

        await expect(page.locator('[data-testid="must-be-admin"]')).not.toBeVisible();
        await expect(page.getByRole('heading', { name: /New game/i })).toBeVisible();

        await page.getByLabel(/Override time check/i).check();
        await page.getByLabel(/Custom message/i).fill(customMessage);
        await page.getByRole('button', { name: 'Submit' }).click();

        await expect(page.getByText('Invitations ready')).toBeVisible({ timeout: 15000 });
        await expect(page.getByText('Invitations can be sent now.')).toBeVisible({ timeout: 15000 });

        let message: MailpitMessageSummary | undefined;
        for (let attempt = 0; attempt < 30; attempt += 1) {
            const res = await page.request.get(`${mailpitUrl}api/v1/messages?limit=20`);
            const data = await res.json() as MailpitMessagesResponse;
            message = data.messages?.find((m) => m.Subject === 'Toastboy FC invitation');
            if (message) break;
            await page.waitForTimeout(1000);
        }

        expect(message).toBeTruthy();
        const messageId = message?.ID ?? '';
        expect(messageId).not.toEqual('');

        const detailRes = await page.request.get(`${mailpitUrl}api/v1/message/${messageId}`);
        const detail = await detailRes.json() as MailpitMessageDetail;
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

        await page.request.delete(`${mailpitUrl}api/v1/messages`);
    });
});
