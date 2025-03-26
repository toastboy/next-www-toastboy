'use server';

import nodemailer from 'nodemailer';

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
    let transporter;

    if (process.env.NODE_ENV === 'production') {
        // Use the Outlook SMTP server in production. Note that this will only
        // work from the HHH IP address since there is a Connector configured to
        // allow it.
        transporter = nodemailer.createTransport({
            host: 'toastboy-co-uk.mail.protection.outlook.com',
            port: 25,
            secure: false,
        });
    }
    else {
        // Use MailPit in development
        transporter = nodemailer.createTransport({
            host: 'localhost',
            port: 1025,
            secure: false,
        });
    }

    await transporter.sendMail({
        from: '"Toastboy FC Mailer" <footy@toastboy.co.uk>',
        to: to,
        subject: subject,
        html: html,
    });
}
