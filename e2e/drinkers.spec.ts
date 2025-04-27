import { expect, test } from '@playwright/test';

test('drinkers page checks', async ({ page }) => {
    await page.goto('/footy/drinkers');

    await expect(page.locator('[data-testid="loading"]')).not.toBeVisible();

    expect(await page.getByText('You must be logged in as an administrator to use this page.').count()).toEqual(1);

    // await page.locator(':nth-match(.pubplayer, 3) [type=checkbox]').check();
    // await page.getByRole('button', { name: 'Submit' }).click();

    // await page.reload();
    // expect(await page.locator(':nth-match(.pubplayer, 3) [type=checkbox]').isChecked());
});
