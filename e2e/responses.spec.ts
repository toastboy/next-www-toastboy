import { expect, type Locator, test } from '@playwright/test';

import { asAdmin, asGuest, asUser } from './utils/auth';

type ResponseOption = 'Yes' | 'No' | 'Dunno';

const groupCount = async (group: Locator) =>
    Number((await group.getAttribute('data-count')) ?? '0');

test.describe('Responses admin page', () => {
    test('denies access to guest users', async ({ page }) => {
        await asGuest(page, '/footy/responses');

        await expect(page.locator('[data-testid="must-be-admin"]')).toBeVisible();
    });

    test('denies access to regular users', async ({ page }) => {
        await asUser(page, '/footy/responses');

        await expect(page.locator('[data-testid="must-be-admin"]')).toBeVisible();
    });

    test('admin can update responses form through realistic response changes', async ({ page }) => {
        await asAdmin(page, '/footy/responses');

        await expect(page.locator('[data-testid="must-be-admin"]')).not.toBeVisible();
        await expect(page.getByRole('heading', { name: /Responses/i })).toBeVisible();

        const yesGroup = page.getByTestId('response-group-yes');
        const noGroup = page.getByTestId('response-group-no');
        const dunnoGroup = page.getByTestId('response-group-dunno');
        const noneGroup = page.getByTestId('response-group-none');

        const initialYes = await groupCount(yesGroup);
        const initialNo = await groupCount(noGroup);
        const initialDunno = await groupCount(dunnoGroup);
        const initialNone = await groupCount(noneGroup);
        expect(initialNone).toBeGreaterThan(0);

        const targetRow = noneGroup.getByTestId('response-row').first();
        const playerName = (await targetRow.getByTestId('player-name').innerText()).trim();
        const playerId = await targetRow.getAttribute('data-player-id');

        if (!playerId) {
            throw new Error('Expected response row to include a data-player-id attribute.');
        }

        const playerRowIn = (group: Locator) =>
            group.locator(`[data-testid="response-row"][data-player-id="${playerId}"]`);

        const setResponseValue = async (row: Locator, response: ResponseOption) => {
            const responseSelect = row.getByTestId('response-select');
            const responseTarget = responseSelect.locator('input, button');
            const target = (await responseTarget.count()) ?
                responseTarget.first() :
                responseSelect;
            await target.click();

            const controlsId = await target.getAttribute('aria-controls');
            if (controlsId) {
                await page.locator(`#${controlsId}`).getByRole('option', { name: response, exact: true }).click();
                return;
            }

            await page
                .locator('[data-combobox-dropdown]:visible')
                .getByRole('option', { name: response, exact: true })
                .click();
        };

        const expectResponseValue = async (row: Locator, response: ResponseOption) => {
            const responseSelect = row.getByTestId('response-select');
            const input = responseSelect.locator('input');
            if (await input.count()) {
                await expect(input).toHaveValue(response);
                return;
            }

            const button = responseSelect.locator('button');
            if (await button.count()) {
                await expect(button).toHaveText(response);
                return;
            }

            await expect(responseSelect).toHaveValue(response);
        };

        const updateResponse = async (group: Locator, response: ResponseOption, goalie: boolean, comment: string) => {
            const row = playerRowIn(group);
            const commentInput = row.getByTestId('comment-input');
            const goalieCheckbox = row.getByTestId('goalie-checkbox');
            await setResponseValue(row, response);
            if (goalie) {
                await goalieCheckbox.check();
            } else {
                await goalieCheckbox.uncheck();
            }
            await commentInput.fill(comment);
            await row.getByTestId('response-submit').click();
        };

        await updateResponse(noneGroup, 'Yes', true, 'Can play and cover goal first half');

        await expect.poll(async () => groupCount(yesGroup)).toBe(initialYes + 1);
        await expect.poll(async () => groupCount(noGroup)).toBe(initialNo);
        await expect.poll(async () => groupCount(dunnoGroup)).toBe(initialDunno);
        await expect.poll(async () => groupCount(noneGroup)).toBe(initialNone - 1);

        const yesRow = yesGroup.getByTestId('response-row').filter({ hasText: playerName });
        await expect(yesRow).toBeVisible({ timeout: 10000 });
        await expectResponseValue(yesRow, 'Yes');
        await expect(yesRow.getByTestId('goalie-checkbox')).toBeChecked();
        await expect(yesRow.getByTestId('comment-input')).toHaveValue('Can play and cover goal first half');

        await updateResponse(yesGroup, 'No', false, 'Out of town this week');

        await expect.poll(async () => groupCount(yesGroup)).toBe(initialYes);
        await expect.poll(async () => groupCount(noGroup)).toBe(initialNo + 1);
        await expect.poll(async () => groupCount(dunnoGroup)).toBe(initialDunno);
        await expect.poll(async () => groupCount(noneGroup)).toBe(initialNone - 1);

        const noRow = noGroup.getByTestId('response-row').filter({ hasText: playerName });
        await expect(noRow).toBeVisible({ timeout: 10000 });
        await expectResponseValue(noRow, 'No');
        await expect(noRow.getByTestId('goalie-checkbox')).not.toBeChecked();
        await expect(noRow.getByTestId('comment-input')).toHaveValue('Out of town this week');

        await updateResponse(noGroup, 'Dunno', false, 'Could make it if meeting ends early');

        await expect.poll(async () => groupCount(yesGroup)).toBe(initialYes);
        await expect.poll(async () => groupCount(noGroup)).toBe(initialNo);
        await expect.poll(async () => groupCount(dunnoGroup)).toBe(initialDunno + 1);
        await expect.poll(async () => groupCount(noneGroup)).toBe(initialNone - 1);

        const dunnoRow = dunnoGroup.getByTestId('response-row').filter({ hasText: playerName });
        await expect(dunnoRow).toBeVisible({ timeout: 10000 });
        await expectResponseValue(dunnoRow, 'Dunno');
        await expect(dunnoRow.getByTestId('goalie-checkbox')).not.toBeChecked();
        await expect(dunnoRow.getByTestId('comment-input')).toHaveValue('Could make it if meeting ends early');

        await updateResponse(dunnoGroup, 'Yes', true, 'Back in: definitely available');

        await expect.poll(async () => groupCount(yesGroup)).toBe(initialYes + 1);
        await expect.poll(async () => groupCount(noGroup)).toBe(initialNo);
        await expect.poll(async () => groupCount(dunnoGroup)).toBe(initialDunno);
        await expect.poll(async () => groupCount(noneGroup)).toBe(initialNone - 1);

        const longComment = 'x'.repeat(128);
        const yesRowFinal = playerRowIn(yesGroup);
        const commentInput = yesRowFinal.getByTestId('comment-input');
        await commentInput.fill(longComment);
        await yesRowFinal.getByTestId('response-submit').click();

        const notificationAlert = page.locator('[data-with-icon="true"][role="alert"]');
        await expect(notificationAlert).toBeVisible();
        await expect(notificationAlert).toContainText('Error');
    });
});
