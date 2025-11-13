'use server';

import nodemailer from 'nodemailer';
import sanitizeHtml from 'sanitize-html';

// Get sender address and name from environment variables, with sensible defaults
const MAIL_FROM_ADDRESS = process.env.MAIL_FROM_ADDRESS || 'footy@toastboy.co.uk';
const MAIL_FROM_NAME = process.env.MAIL_FROM_NAME || 'Toastboy FC Mailer';
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
    const transporter = process.env.NODE_ENV === 'production'
        ? nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'toastboy-co-uk.mail.protection.outlook.com',
            port: 25,
            secure: false,
        })
        : nodemailer.createTransport({
            host: 'localhost',
            port: 1025,
            secure: false,
        });

    // Sanitize HTML before sending email
    const sanitizedHtml = sanitizeHtml(html);

    try {
        await transporter.sendMail({
            from: `"${MAIL_FROM_NAME}" <${MAIL_FROM_ADDRESS}>`,
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
        throw new Error(`Failed to send email to ${to} with subject "${subject}": ${error instanceof Error ? error.message : String(error)}`);
    }
}
