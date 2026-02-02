import { expect, test } from '@playwright/test';

import { asAdmin, asGuest, asUser } from './utils/auth';

test.describe('Responses admin page (TDD)', () => {
    test('denies access to guest users', async ({ page }) => {
        await asGuest(page, '/footy/responses');

        await expect(page.locator('[data-testid="must-be-admin"]')).toBeVisible();
    });

    test('denies access to regular users', async ({ page }) => {
        await asUser(page, '/footy/responses');

        await expect(page.locator('[data-testid="must-be-admin"]')).toBeVisible();
    });

    test('admin can update a player response and counts adjust', async ({ page }) => {
        await asAdmin(page, '/footy/responses');

        await expect(page.locator('[data-testid="must-be-admin"]')).not.toBeVisible();
        await expect(page.getByRole('heading', { name: /Responses/i })).toBeVisible();

        const yesGroup = page.getByTestId('response-group-yes');
        const noGroup = page.getByTestId('response-group-no');
        const noneGroup = page.getByTestId('response-group-none');

        const yesCountBefore = Number(await yesGroup.getAttribute('data-count') ?? '0');
        const noCountBefore = Number(await noGroup.getAttribute('data-count') ?? '0');
        const noneCountBefore = Number(await noneGroup.getAttribute('data-count') ?? '0');

        const targetRow = noneGroup.getByTestId('response-row').first();
        const playerName = (await targetRow.getByTestId('player-name').innerText()).trim();

        await targetRow.getByTestId('response-select').selectOption('Yes');
        await targetRow.getByTestId('goalie-checkbox').check();
        await targetRow.getByTestId('comment-input').fill('Playwright admin updated response');
        await targetRow.getByTestId('response-submit').click();

        await expect(page.getByText('Response updated')).toBeVisible({ timeout: 15000 });

        const yesCountAfter = Number(await yesGroup.getAttribute('data-count') ?? '0');
        const noneCountAfter = Number(await noneGroup.getAttribute('data-count') ?? '0');

        expect(yesCountAfter).toBe(yesCountBefore + 1);
        expect(noneCountAfter).toBe(Math.max(0, noneCountBefore - 1));
        expect(noCountBefore).toBe(Number(await noGroup.getAttribute('data-count') ?? '0'));

        const movedRow = yesGroup.getByTestId('response-row').filter({ hasText: playerName });
        await expect(movedRow).toBeVisible({ timeout: 10000 });
        await expect(movedRow.getByTestId('response-select')).toHaveValue('Yes');
        await expect(movedRow.getByTestId('goalie-checkbox')).toBeChecked();
        await expect(movedRow.getByTestId('comment-input')).toHaveValue('Playwright admin updated response');
    });
});
