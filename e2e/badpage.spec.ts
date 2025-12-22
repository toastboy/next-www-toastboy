import { expect, test } from '@/tests/playwright/fixtures';

test.fail('check what happens when a nonexistent page is requested', async ({ page }) => {
    const response = await page.goto('/footy/nonexistentpage');
    expect(response?.ok()).toBeFalsy();
});
