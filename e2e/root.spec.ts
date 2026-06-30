import { expect, test } from './utils/base';

test('root page redirects to /footy', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/footy$/);
});
