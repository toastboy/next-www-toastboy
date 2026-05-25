import { expect, test } from '@playwright/test';

import { deleteAllMessages, getMessageDetail, waitForMessage } from './utils/mailpit';

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
        const submitButton = page.getByRole('button', { name: 'Send message' });

        await submitButton.scrollIntoViewIfNeeded();

        await submitButton.click();
        await submitButton.scrollIntoViewIfNeeded();
        await expect(page.getByText('Name is required')).toBeVisible();
        await expect(page.getByText('Invalid email')).toBeVisible();
        await expect(page.getByText('Message is required')).toBeVisible();
    });

    test('shows invalid email error on blur', async ({ page }) => {
        await page.goto('/footy/info');
        await page.getByRole('textbox', { name: 'Name' }).fill('Test User');
        const emailInput = page.getByRole('textbox', { name: 'Email' });
        await emailInput.fill('not-an-email');
        await page.getByRole('textbox', { name: 'Message' }).click();
        const invalidEmailError = page.getByText('Invalid email');
        await emailInput.scrollIntoViewIfNeeded();
        await expect(invalidEmailError).toBeVisible();
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
            await page.getByRole('textbox', { name: 'Name' }).fill('Test User');
            await page.getByRole('textbox', { name: 'Email' }).fill('playwright@example.com');
            await page.getByRole('textbox', { name: 'Message' }).fill('This is a test enquiry from Playwright.');
            await page.getByRole('button', { name: 'Send message' }).click();

            await expect(page.getByText('Confirm your email')).toBeVisible();
            await expect(page.getByRole('textbox', { name: 'Name' })).toHaveValue('');
            await expect(page.getByRole('textbox', { name: 'Email' })).toHaveValue('');
            await expect(page.getByRole('textbox', { name: 'Message' })).toHaveValue('');

            const message = await waitForMessage(request, 'Confirm your enquiry');
            expect(message, 'Expected verification email in Mailpit').toBeTruthy();
        });

        test('completes full verification flow', async ({ page, request }) => {
            await page.goto('/footy/info');
            await page.getByRole('textbox', { name: 'Name' }).fill('Verification Tester');
            await page.getByRole('textbox', { name: 'Email' }).fill('verify@example.com');
            await page.getByRole('textbox', { name: 'Message' }).fill('Please verify this enquiry.');
            await page.getByRole('button', { name: 'Send message' }).click();

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
