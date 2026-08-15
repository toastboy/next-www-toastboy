import { asAdmin, asGuest, asUser, mustBeLoggedInAsAdmin } from './utils/auth';
import { expect, test } from './utils/base';

type ResponseOption = 'Yes' | 'No' | 'Dunno';

test.describe('Responses admin page', () => {
    test('denies access to guest users', async ({ page }) => {
        await asGuest(page, '/footy/admin/responses');

        await mustBeLoggedInAsAdmin(page);
    });

    test('denies access to regular users', async ({ page }) => {
        await asUser(page, '/footy/admin/responses');

        await mustBeLoggedInAsAdmin(page);
    });

    test('admin can update responses form through realistic response changes', async ({
        page,
    }) => {
        await asAdmin(page, '/footy/admin/responses');

        await expect(
            page.getByRole('heading', { name: /Responses/i }).first(),
        ).toBeVisible();

        // Read a group's player count from its h2 heading ("Yes: 15").
        // CSS + text filter works regardless of whether the card has an explicit ARIA role.
        const groupCount = async (title: string) => {
            const heading = page
                .locator('h2')
                .filter({ hasText: new RegExp(`^${title}:\\s*`) });
            if ((await heading.count()) === 0) return 0;
            const text = await heading.first().innerText();
            const match = /:\s*(\d+)$/.exec(text.trim());
            return match ? Number(match[1]) : 0;
        };

        const initialYes = await groupCount('Yes');
        const initialNo = await groupCount('No');
        const initialDunno = await groupCount('Dunno');
        const initialNone = await groupCount('None');

        const startsFromNone = initialNone > 0;
        const yesAfterFirstUpdate = startsFromNone
            ? initialYes + 1
            : initialYes;
        const noneAfterFirstUpdate = startsFromNone
            ? initialNone - 1
            : initialNone;

        // Yes group renders before None; skip past Yes rows to reach the first None player.
        // Group cards are collapsed by default, but data-player-id attributes are readable
        // on hidden elements without needing the group expanded first.
        const targetRow = page
            .locator('[data-player-id]')
            .nth(startsFromNone ? initialYes : 0);
        const playerId = await targetRow.getAttribute('data-player-id');

        if (!playerId) {
            throw new Error(
                'Expected player row to have a data-player-id attribute.',
            );
        }

        // Tracks the player by ID across group changes — they appear in exactly one group at a time.
        const playerRow = page.locator(`[data-player-id="${playerId}"]`);

        // Groups render collapsed; expand the one containing the player before interacting
        // with its row. A group heading's accessible name is "<Title>: <count>".
        const expandGroup = async (title: string) => {
            const button = page.getByRole('button', {
                name: new RegExp(`^${title}:`),
            });
            await expect(button.first()).toBeVisible({ timeout: 10000 });
            if (
                (await button.first().getAttribute('aria-expanded')) !== 'true'
            ) {
                await button.first().click();
            }
        };

        await expandGroup(startsFromNone ? 'None' : 'Yes');

        const setResponseValue = async (response: ResponseOption) => {
            const combobox = playerRow.getByRole('combobox', {
                name: /response/i,
            });

            // Shared fixture data means the target player's response may already match
            // (e.g. carried over from an earlier project in the same suite run); re-selecting
            // an already-selected option is unreliable, so skip the interaction entirely.
            if ((await combobox.inputValue()) === response) return;

            // The SSE-triggered refresh (see the comment in updatePlayer below) can land
            // mid-interaction and remount the row, closing the dropdown before the option
            // is clicked. Retry the open-then-select sequence rather than failing outright.
            await expect(async () => {
                await combobox.click();
                await page
                    .getByRole('option', { name: response, exact: true })
                    .click({ timeout: 3000 });
            }).toPass({ timeout: 20000 });
        };

        const updatePlayer = async (
            response: ResponseOption,
            goalie: boolean,
            comment: string,
        ) => {
            await setResponseValue(response);
            if (goalie) {
                await playerRow
                    .getByRole('checkbox', { name: /goalie/i })
                    .check();
            } else {
                await playerRow
                    .getByRole('checkbox', { name: /goalie/i })
                    .uncheck();
            }
            await playerRow.getByPlaceholder('Comment').fill(comment);
            await playerRow.getByRole('button', { name: 'Update' }).click();
            // Wait for handleSubmit to fully resolve before the next update.
            // The server broadcasts before returning its RPC response, so the
            // SSE-triggered page refresh can arrive while the button is still
            // loading. Clicking Update on a loading Mantine button is a no-op.
            await expect(
                page.getByText('Response updated successfully'),
            ).toBeVisible({ timeout: 15000 });
        };

        await updatePlayer('Yes', true, 'Can play and cover goal first half');

        await expect
            .poll(async () => groupCount('Yes'), { timeout: 10000 })
            .toBe(yesAfterFirstUpdate);
        await expect
            .poll(async () => groupCount('No'), { timeout: 10000 })
            .toBe(initialNo);
        await expect
            .poll(async () => groupCount('Dunno'), { timeout: 10000 })
            .toBe(initialDunno);
        await expect
            .poll(async () => groupCount('None'), { timeout: 10000 })
            .toBe(noneAfterFirstUpdate);

        await expandGroup('Yes');
        await expect(playerRow).toBeVisible({ timeout: 10000 });
        await expect(
            playerRow.getByRole('checkbox', { name: /goalie/i }),
        ).toBeChecked();
        await expect(playerRow.getByPlaceholder('Comment')).toHaveValue(
            'Can play and cover goal first half',
        );

        await updatePlayer('No', false, 'Out of town this week');

        await expect
            .poll(async () => groupCount('Yes'), { timeout: 10000 })
            .toBe(yesAfterFirstUpdate - 1);
        await expect
            .poll(async () => groupCount('No'), { timeout: 10000 })
            .toBe(initialNo + 1);
        await expect
            .poll(async () => groupCount('Dunno'), { timeout: 10000 })
            .toBe(initialDunno);
        await expect
            .poll(async () => groupCount('None'), { timeout: 10000 })
            .toBe(noneAfterFirstUpdate);

        await expandGroup('No');
        await expect(playerRow).toBeVisible({ timeout: 10000 });
        await expect(
            playerRow.getByRole('checkbox', { name: /goalie/i }),
        ).not.toBeChecked();
        await expect(playerRow.getByPlaceholder('Comment')).toHaveValue(
            'Out of town this week',
        );

        await updatePlayer(
            'Dunno',
            false,
            'Could make it if meeting ends early',
        );

        await expect
            .poll(async () => groupCount('Yes'), { timeout: 10000 })
            .toBe(yesAfterFirstUpdate - 1);
        await expect
            .poll(async () => groupCount('No'), { timeout: 10000 })
            .toBe(initialNo);
        await expect
            .poll(async () => groupCount('Dunno'), { timeout: 10000 })
            .toBe(initialDunno + 1);
        await expect
            .poll(async () => groupCount('None'), { timeout: 10000 })
            .toBe(noneAfterFirstUpdate);

        await expandGroup('Dunno');
        await expect(playerRow).toBeVisible({ timeout: 10000 });
        await expect(
            playerRow.getByRole('checkbox', { name: /goalie/i }),
        ).not.toBeChecked();
        await expect(playerRow.getByPlaceholder('Comment')).toHaveValue(
            'Could make it if meeting ends early',
        );

        await updatePlayer('Yes', true, 'Back in: definitely available');

        await expect
            .poll(async () => groupCount('Yes'), { timeout: 10000 })
            .toBe(yesAfterFirstUpdate);
        await expect
            .poll(async () => groupCount('No'), { timeout: 10000 })
            .toBe(initialNo);
        await expect
            .poll(async () => groupCount('Dunno'), { timeout: 10000 })
            .toBe(initialDunno);
        await expect
            .poll(async () => groupCount('None'), { timeout: 10000 })
            .toBe(noneAfterFirstUpdate);
    });
});
