import { expect, test } from './utils/base';
import {
    deleteAllMessages,
    getMessageDetail,
    waitForMessage,
} from './utils/mailpit';

const extractVerificationLink = (content: string) => {
    const hrefMatch =
        /href=["']([^"']*\/footy\/auth\/verify\/enquiry\/[^"']*)["']/i.exec(
            content,
        );
    if (hrefMatch?.[1]) return hrefMatch[1];

    const textMatch =
        /(https?:\/\/[^\s"']*\/footy\/auth\/verify\/enquiry\/[^\s"']+)/i.exec(
            content,
        );
    return textMatch?.[1] ?? null;
};

test('info page', async ({ page }) => {
    const response = await page.goto('/footy/info');
    expect(response?.ok()).toBeTruthy();
    await expect(page).toHaveURL(/.*info/);
    await expect(page).toHaveTitle(/Toastboy FC/);
    // await expect(page).toHaveScreenshot('info.png', {
    //     mask: [page.locator('iframe[src*="google.com/maps"]')],
    // });
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

    test.describe('email flow', () => {
        test.describe.configure({ mode: 'serial' });

        test.beforeEach(async ({ request }) => {
            await deleteAllMessages(request);
        });

        test.afterEach(async ({ request }) => {
            await deleteAllMessages(request);
        });

        test('submits form and shows confirmation notification', async ({
            page,
            request,
        }) => {
            await page.goto('/footy/info');
            const nameInput = page.getByRole('textbox', { name: 'Name' });
            const emailInput = page.getByRole('textbox', { name: 'Email' });
            const messageInput = page.getByRole('textbox', {
                name: 'Message',
            });

            // Assert each value lands in Mantine's controlled form state
            // before moving on: WebKit can occasionally process fill()'s
            // synthetic input event slower than React's onChange commit,
            // and since submit buttons stay enabled while invalid (by
            // design), a not-yet-committed field fails validation silently
            // instead of the click being a no-op.
            await nameInput.fill('Test User');
            await expect(nameInput).toHaveValue('Test User');
            await emailInput.fill('playwright@example.com');
            await expect(emailInput).toHaveValue('playwright@example.com');
            await messageInput.fill('This is a test enquiry from Playwright.');
            await expect(messageInput).toHaveValue(
                'This is a test enquiry from Playwright.',
            );
            await page.getByRole('button', { name: 'Send message' }).click();

            await expect(page.getByText('Confirm your email')).toBeVisible({
                timeout: 15000,
            });
            await expect(
                page.getByRole('textbox', { name: 'Name' }),
            ).toHaveValue('');
            await expect(
                page.getByRole('textbox', { name: 'Email' }),
            ).toHaveValue('');
            await expect(
                page.getByRole('textbox', { name: 'Message' }),
            ).toHaveValue('');

            const message = await waitForMessage(
                request,
                'Confirm your enquiry',
            );
            expect(
                message,
                'Expected verification email in Mailpit',
            ).toBeTruthy();
        });

        test('completes full verification flow', async ({ page, request }) => {
            await page.goto('/footy/info');
            const nameInput = page.getByRole('textbox', { name: 'Name' });
            const emailInput = page.getByRole('textbox', { name: 'Email' });
            const messageInput = page.getByRole('textbox', {
                name: 'Message',
            });

            await nameInput.fill('Verification Tester');
            await expect(nameInput).toHaveValue('Verification Tester');
            await emailInput.fill('verify@example.com');
            await expect(emailInput).toHaveValue('verify@example.com');
            await messageInput.fill('Please verify this enquiry.');
            await expect(messageInput).toHaveValue(
                'Please verify this enquiry.',
            );
            await page.getByRole('button', { name: 'Send message' }).click();

            await expect(page.getByText('Confirm your email')).toBeVisible({
                timeout: 15000,
            });

            const message = await waitForMessage(
                request,
                'Confirm your enquiry',
            );
            if (!message)
                throw new Error('Verification email not found in Mailpit');

            const detail = await getMessageDetail(request, message.ID);
            const body = detail.HTML ?? detail.Text ?? '';
            const verificationLink = extractVerificationLink(body);
            if (!verificationLink)
                throw new Error(
                    `Verification link not found in email body:\n${body}`,
                );

            await page.goto(verificationLink);
            await expect(page).toHaveURL(/\/footy\/auth\/verify\/enquiry\//);
            // Firefox can briefly double-mount this static server-rendered
            // Notification during hydration (self-heals within ~1s); .first()
            // avoids the resulting strict-mode violation without weakening
            // the assertion, since the content itself never varies.
            await expect(
                page.getByText('Thanks for your message').first(),
            ).toBeVisible();
        });
    });
});
