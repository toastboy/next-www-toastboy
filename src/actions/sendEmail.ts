'use server';

import { sendEmailCore } from '@/lib/actions/sendEmail';

/**
 * Sends an email using the appropriate SMTP server configuration based on the environment.
 *
 * In production, it uses the Outlook SMTP server configured for the application.
 * In development, it uses MailPit for local email testing.
 *
 * @param to - The recipient's email address.
 * @param subject - The subject of the email.
 * @param html - The HTML content of the email.
 * @throws Will throw an error if the email fails to send.
 */
export async function sendEmail(to: string, cc: string, subject: string, html: string) {
    await sendEmailCore(to, cc, subject, html);
}
