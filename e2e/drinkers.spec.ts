import { expect, test } from '@playwright/test';

test('drinkers page checks', async ({ page }) => {
    await page.goto('/footy/drinkers');

    expect(await page.getByText('You must be logged in as an administrator to use this page.').count()).toEqual(1);

    await page.getByLabel('Username:').fill('testadmin');
    await page.getByLabel('Password:').fill('correcthorse');

    await page.getByRole('button', { name: 'Log in' }).click();
    await expect(page).toHaveURL(/\/footy\/drinkers/);

    expect(await page.getByText('Bad login: try again').count()).toEqual(0);

    await page.screenshot({ path: 'test-results/screenshots/drinker_before_click.png', fullPage: true });

    await page.locator(':nth-match(.pubplayer, 3) [type=checkbox]').check();
    await page.getByRole('button', { name: 'Submit' }).click();

    await page.reload();
    expect(await page.locator(':nth-match(.pubplayer, 3) [type=checkbox]').isChecked());

    const logout = page.getByText('Log Out');
    expect(await logout.count()).toEqual(1);
    await logout.click();
});