import type { Locator } from '@playwright/test';

import { expect, test } from './utils/base';
import {
    deleteAllMessages,
    getMessageDetail,
    waitForMessage,
} from './utils/mailpit';

/**
 * `fill()` can land before Next.js finishes hydrating and attaches Mantine's
 * controlled onChange handler: the DOM value gets set natively, then wiped
 * when hydration commits React's still-empty initial state. `networkidle`
 * doesn't reliably signal that hydration is done (hydration can finish after
 * the last network request settles, or the reverse), so instead of guessing
 * at readiness, retry the fill itself - along with the read - until the
 * value actually sticks. This converges regardless of how long hydration
 * takes, and once it succeeds once on a page, the whole tree is hydrated, so
 * later interactions on the same page don't need to go through this.
 */
const fillWhenHydrated = async (locator: Locator, value: string) => {
    await expect(async () => {
        await locator.fill(value);
        await expect(locator).toHaveValue(value);
    }).toPass({ timeout: 10000 });
};

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
        const nameInput = page.getByRole('textbox', { name: 'Name' });
        // Confirm hydration before clicking submit on an otherwise-untouched
        // form: clicking before the onSubmit handler is attached falls
        // through to a native form GET submission, navigating the page.
        await fillWhenHydrated(nameInput, 'hydration probe');
        await nameInput.fill('');
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
        await fillWhenHydrated(
            page.getByRole('textbox', { name: 'Name' }),
            'Test User',
        );
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

            await fillWhenHydrated(nameInput, 'Test User');
            await emailInput.fill('playwright@example.com');
            await messageInput.fill('This is a test enquiry from Playwright.');
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

            await fillWhenHydrated(nameInput, 'Verification Tester');
            await emailInput.fill('verify@example.com');
            await messageInput.fill('Please verify this enquiry.');
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
