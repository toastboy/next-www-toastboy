'use server';

import { getSecrets } from 'lib/secrets';
import nodemailer from 'nodemailer';
import sanitizeHtml from 'sanitize-html';

const secrets = getSecrets();

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
export async function sendEmail(to: string, subject: string, html: string) {
    const transporter = process.env.NODE_ENV === 'production' && !process.env.CI ?
        nodemailer.createTransport({
            host: secrets.SMTP_HOST,
            port: 25,
            secure: false,
        }) :
        nodemailer.createTransport({
            host: 'localhost',
            port: 1025,
            secure: false,
        });

    // Sanitize HTML before sending email
    const sanitizedHtml = sanitizeHtml(html);

    try {
        await transporter.sendMail({
            from: `"${secrets.MAIL_FROM_NAME}" <${secrets.MAIL_FROM_ADDRESS}>`,
            to: to,
            subject: subject,
            html: sanitizedHtml,
        });
    } catch (error) {
        console.error(`Failed to send email`, {
            to,
            subject,
            error,
        });
        throw new Error(`Failed to send email: ${error instanceof Error ? error.message : String(error)}`);
    }
}
