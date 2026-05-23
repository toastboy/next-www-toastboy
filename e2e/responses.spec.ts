import { asAdmin, asGuest, asUser, mustBeLoggedInAsAdmin } from './utils/auth';
import { expect, type Locator, test } from './utils/test';

type ResponseOption = 'Yes' | 'No' | 'Dunno';

const groupCount = async (group: Locator) => {
    if ((await group.count()) === 0) {
        return 0;
    }

    const heading = group.getByRole('heading');
    const text = await heading.innerText();
    const match = /:\s*(\d+)$/.exec(text.trim());
    return match ? Number(match[1]) : 0;
};

test.describe('Responses admin page', () => {
    test('denies access to guest users', async ({ page }) => {
        await asGuest(page, '/footy/admin/responses');

        await mustBeLoggedInAsAdmin(page);
    });

    test('denies access to regular users', async ({ page }) => {
        await asUser(page, '/footy/admin/responses');

        await mustBeLoggedInAsAdmin(page);
    });

    test('admin can update responses form through realistic response changes', async ({ page }) => {
        await asAdmin(page, '/footy/admin/responses');

        await expect(page.getByRole('heading', { name: /Responses/i })).toBeVisible();

        const yesGroup = page.getByRole('region', { name: 'Yes' });
        const noGroup = page.getByRole('region', { name: 'No' });
        const dunnoGroup = page.getByRole('region', { name: 'Dunno' });
        const noneGroup = page.getByRole('region', { name: 'None' });

        const initialYes = await groupCount(yesGroup);
        const initialNo = await groupCount(noGroup);
        const initialDunno = await groupCount(dunnoGroup);
        const initialNone = await groupCount(noneGroup);

        const startsFromNone = initialNone > 0;
        const starterGroup = startsFromNone ? noneGroup : yesGroup;
        const yesAfterFirstUpdate = startsFromNone ? initialYes + 1 : initialYes;
        const noneAfterFirstUpdate = startsFromNone ? initialNone - 1 : initialNone;

        const targetRow = starterGroup.getByRole('group').first();
        const playerName = await targetRow.getAttribute('aria-label');

        if (!playerName) {
            throw new Error('Expected response row to have an aria-label attribute.');
        }

        const playerRowIn = (group: Locator) =>
            group.getByRole('group', { name: playerName });

        const setResponseValue = async (row: Locator, response: ResponseOption) => {
            await row.getByRole('combobox', { name: /response/i }).click();
            await page.getByRole('option', { name: response, exact: true }).click();
        };

        const updateResponse = async (group: Locator, response: ResponseOption, goalie: boolean, comment: string) => {
            const row = playerRowIn(group);
            const commentInput = row.getByPlaceholder('Comment');
            const goalieCheckbox = row.getByRole('checkbox', { name: /goalie/i });
            await setResponseValue(row, response);
            if (goalie) {
                await goalieCheckbox.check();
            } else {
                await goalieCheckbox.uncheck();
            }
            await commentInput.fill(comment);
            await row.getByRole('button', { name: 'Update' }).click();
        };

        await updateResponse(starterGroup, 'Yes', true, 'Can play and cover goal first half');

        await expect.poll(async () => groupCount(yesGroup)).toBe(yesAfterFirstUpdate);
        await expect.poll(async () => groupCount(noGroup)).toBe(initialNo);
        await expect.poll(async () => groupCount(dunnoGroup)).toBe(initialDunno);
        await expect.poll(async () => groupCount(noneGroup)).toBe(noneAfterFirstUpdate);

        const yesRow = yesGroup.getByRole('group', { name: playerName });
        await expect(yesRow).toBeVisible({ timeout: 10000 });
        await expect(yesRow.getByRole('checkbox', { name: /goalie/i })).toBeChecked();
        await expect(yesRow.getByPlaceholder('Comment')).toHaveValue('Can play and cover goal first half');

        await updateResponse(yesGroup, 'No', false, 'Out of town this week');

        await expect.poll(async () => groupCount(yesGroup)).toBe(yesAfterFirstUpdate - 1);
        await expect.poll(async () => groupCount(noGroup)).toBe(initialNo + 1);
        await expect.poll(async () => groupCount(dunnoGroup)).toBe(initialDunno);
        await expect.poll(async () => groupCount(noneGroup)).toBe(noneAfterFirstUpdate);

        const noRow = noGroup.getByRole('group', { name: playerName });
        await expect(noRow).toBeVisible({ timeout: 10000 });
        await expect(noRow.getByRole('checkbox', { name: /goalie/i })).not.toBeChecked();
        await expect(noRow.getByPlaceholder('Comment')).toHaveValue('Out of town this week');

        await updateResponse(noGroup, 'Dunno', false, 'Could make it if meeting ends early');

        await expect.poll(async () => groupCount(yesGroup)).toBe(yesAfterFirstUpdate - 1);
        await expect.poll(async () => groupCount(noGroup)).toBe(initialNo);
        await expect.poll(async () => groupCount(dunnoGroup)).toBe(initialDunno + 1);
        await expect.poll(async () => groupCount(noneGroup)).toBe(noneAfterFirstUpdate);

        const dunnoRow = dunnoGroup.getByRole('group', { name: playerName });
        await expect(dunnoRow).toBeVisible({ timeout: 10000 });
        await expect(dunnoRow.getByRole('checkbox', { name: /goalie/i })).not.toBeChecked();
        await expect(dunnoRow.getByPlaceholder('Comment')).toHaveValue('Could make it if meeting ends early');

        await updateResponse(dunnoGroup, 'Yes', true, 'Back in: definitely available');

        await expect.poll(async () => groupCount(yesGroup)).toBe(yesAfterFirstUpdate);
        await expect.poll(async () => groupCount(noGroup)).toBe(initialNo);
        await expect.poll(async () => groupCount(dunnoGroup)).toBe(initialDunno);
        await expect.poll(async () => groupCount(noneGroup)).toBe(noneAfterFirstUpdate);

    });
});
