import { expect, test } from '@playwright/test';

test('login form denies a bad user', async ({ page }) => {
  await page.goto('/footy/');
  await expect(page.locator('[data-testid="loading"]')).not.toBeVisible();

  await page.getByLabel('Username:').click();

  await page.getByLabel('Username:').fill('testuser');

  await page.getByLabel('Password:').click();

  await page.getByLabel('Password:').fill('schmassword');

  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page).toHaveURL('/footy/');

  expect(await page.getByText('Bad login: try again').count()).toEqual(1);
  const logout = page.getByText('Log Out');
  expect(await logout.count()).toEqual(0);

});

test('login form works for a good ordinary user', async ({ page }) => {

  await page.goto('/footy/');

  await page.getByLabel('Username:').click();

  await page.getByLabel('Username:').fill('testuser');

  await page.getByLabel('Password:').click();

  await page.getByLabel('Password:').fill('testpassword');

  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page).toHaveURL('/footy/');

  expect(await page.getByText('Bad login: try again').count()).toEqual(0);
  const logout = page.getByText('Log Out');
  expect(await logout.count()).toEqual(1);
  await logout.click();
});

test('login form works for a good admin user', async ({ page }) => {

  await page.goto('/footy/');

  await page.getByLabel('Username:').click();

  await page.getByLabel('Username:').fill('testadmin');

  await page.getByLabel('Password:').click();

  await page.getByLabel('Password:').fill('correcthorse');

  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page).toHaveURL('/footy/');

  expect(await page.getByText('Bad login: try again').count()).toEqual(0);
  const logout = page.getByText('Log Out');
  expect(await logout.count()).toEqual(1);
  await logout.click();
});
