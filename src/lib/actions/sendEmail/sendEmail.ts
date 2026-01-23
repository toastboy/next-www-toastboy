import 'server-only';

import nodemailer from 'nodemailer';
import sanitizeHtml from 'sanitize-html';

import { getSecrets } from '@/lib/secrets';

/**
 * Sends an email using the configured SMTP transporter.
 *
 * Depending on the environment, it uses either production SMTP settings or a
 * local SMTP server. The HTML content of the email is sanitized before sending.
 *
 * @param to - The recipient's email address.
 * @param cc - The CC recipient's email address.
 * @param subject - The subject of the email.
 * @param html - The HTML content of the email.
 * @throws Throws an error if the email fails to send.
 */
export async function sendEmailCore(to: string, cc: string, subject: string, html: string) {
    const secrets = getSecrets();
    const transporter = process.env.NODE_ENV === 'production' && !process.env.CI
        ? nodemailer.createTransport({
            host: secrets.SMTP_HOST,
            port: 25,
            secure: false,
        })
        : nodemailer.createTransport({
            host: 'localhost',
            port: 1025,
            secure: false,
        });

    const sanitizedHtml = sanitizeHtml(html);

    try {
        await transporter.sendMail({
            from: `"${secrets.MAIL_FROM_NAME}" <${secrets.MAIL_FROM_ADDRESS}>`,
            to,
            cc,
            subject,
            html: sanitizedHtml,
        });
    } catch (error) {
        console.error('Failed to send email', {
            to,
            subject,
            error,
        });
        throw new Error(`Failed to send email: ${error instanceof Error ? error.message : String(error)}`);
    }
}
