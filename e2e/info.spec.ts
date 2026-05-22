import { deleteAllMessages, getMessageDetail, waitForMessage } from './utils/mailpit';
import { expect, test } from './utils/test';

test('info page', async ({ page }) => {
    const response = await page.goto('/footy/info');
    expect(response?.ok()).toBeTruthy();
    await expect(page).toHaveURL(/.*info/);
    await expect(page).toHaveTitle(/Toastboy FC/);
    await expect(page).toHaveScreenshot('info.png', {
        mask: [page.locator('iframe[src*="google.com/maps"]')],
    });
});

test.describe('EnquiryForm', () => {
    test('shows validation errors on empty submit', async ({ page }) => {
        await page.goto('/footy/info');
        await page.getByTestId('enquiry-submit').click();
        await expect(page.getByText('Name is required')).toBeVisible();
        await expect(page.getByText('Invalid email')).toBeVisible();
        await expect(page.getByText('Message is required')).toBeVisible();
    });

    test('shows invalid email error on blur', async ({ page }) => {
        await page.goto('/footy/info');
        await page.getByTestId('enquiry-name').fill('Test User');
        await page.getByTestId('enquiry-email').fill('not-an-email');
        await page.getByTestId('enquiry-message').click();
        await expect(page.getByText('Invalid email')).toBeVisible();
    });

    test('shows verified notification and cleans up URL', async ({ page }) => {
        await page.goto('/footy/info?enquiry=verified');
        await expect(page.getByText('Email verified')).toBeVisible();
        await expect(page).toHaveURL(/\/footy\/info$/);
    });

    test('shows error notification and cleans up URL', async ({ page }) => {
        await page.goto('/footy/info?enquiry=error');
        await expect(page.getByText('Verification failed')).toBeVisible();
        await expect(page).toHaveURL(/\/footy\/info$/);
    });

    test.describe('email flow', () => {
        test.describe.configure({ mode: 'serial' });

        test.beforeEach(async ({ request }) => {
            await deleteAllMessages(request);
        });

        test.afterEach(async ({ request }) => {
            await deleteAllMessages(request);
        });

        test('submits form and shows confirmation notification', async ({ page, request }) => {
            await page.goto('/footy/info');
            await page.getByTestId('enquiry-name').fill('Test User');
            await page.getByTestId('enquiry-email').fill('playwright@example.com');
            await page.getByTestId('enquiry-message').fill('This is a test enquiry from Playwright.');
            await page.getByTestId('enquiry-submit').click();

            await expect(page.getByText('Confirm your email')).toBeVisible();
            await expect(page.getByTestId('enquiry-name')).toHaveValue('');
            await expect(page.getByTestId('enquiry-email')).toHaveValue('');
            await expect(page.getByTestId('enquiry-message')).toHaveValue('');

            const message = await waitForMessage(request, 'Confirm your enquiry');
            expect(message, 'Expected verification email in Mailpit').toBeTruthy();
        });

        test('completes full verification flow', async ({ page, request }) => {
            await page.goto('/footy/info');
            await page.getByTestId('enquiry-name').fill('Verification Tester');
            await page.getByTestId('enquiry-email').fill('verify@example.com');
            await page.getByTestId('enquiry-message').fill('Please verify this enquiry.');
            await page.getByTestId('enquiry-submit').click();

            await expect(page.getByText('Confirm your email')).toBeVisible();

            const message = await waitForMessage(request, 'Confirm your enquiry');
            expect(message, 'Expected verification email in Mailpit').toBeTruthy();

            const detail = await getMessageDetail(request, message!.ID);
            const body = detail.HTML ?? detail.Text ?? '';
            const linkMatch = /href="([^"]*\/api\/footy\/auth\/verify\/enquiry\/[^"]*)"/.exec(body);
            expect(linkMatch, 'Expected verification link in email body').toBeTruthy();

            await page.goto(linkMatch![1]);
            await expect(page).toHaveURL(/\/footy\/info/);
            await expect(page.getByText('Email verified')).toBeVisible();
        });
    });
});
