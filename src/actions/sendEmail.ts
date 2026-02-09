'use server';

import type { SendMailOptions } from 'nodemailer';

import { sendEmailCore } from '@/lib/actions/sendEmail';

/**
 * Sends an email using the appropriate SMTP server configuration based on the environment.
 *
 * In production, it uses the Outlook SMTP server configured for the application.
 * In development, it uses MailPit for local email testing.
 *
 * @param mailOptions - Nodemailer mail options payload.
 * @throws Will throw an error if the email fails to send.
 */
export async function sendEmail(mailOptions: SendMailOptions) {
    await sendEmailCore(mailOptions);
}
