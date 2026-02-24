import 'server-only';

import nodemailer, { type SendMailOptions } from 'nodemailer';
import sanitizeHtml from 'sanitize-html';

import { ExternalServiceError, normalizeUnknownError } from '@/lib/errors';
import { captureUnexpectedError } from '@/lib/observability/sentry';
import { getSecrets } from '@/lib/secrets';

/**
 * Sends an email using the configured SMTP transporter.
 *
 * Depending on the environment, it uses either production SMTP settings or a
 * local SMTP server. The HTML content of the email is sanitized before sending.
 *
 * @param mailOptions - Nodemailer mail options payload.
 * @throws {ExternalServiceError} If SMTP delivery fails.
 */
export async function sendEmailCore(mailOptions: SendMailOptions) {
    const secrets = getSecrets();
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

    const sanitizedHtml =
        typeof mailOptions.html === 'string' ?
            sanitizeHtml(mailOptions.html) :
            mailOptions.html ?? undefined;

    try {
        await transporter.sendMail({
            ...mailOptions,
            from: `"${secrets.MAIL_FROM_NAME}" <${secrets.MAIL_FROM_ADDRESS}>`,
            ...(sanitizedHtml !== undefined ? { html: sanitizedHtml } : {}),
        });
    } catch (error) {
        const normalizedError = normalizeUnknownError(error, {
            details: {
                to: mailOptions.to,
                subject: mailOptions.subject,
            },
        });
        captureUnexpectedError(normalizedError, {
            layer: 'server-action',
            action: 'sendEmailCore',
            extra: {
                to: mailOptions.to,
                subject: mailOptions.subject,
            },
        });
        throw new ExternalServiceError(
            `Failed to send email: ${normalizedError.message}`,
            {
                cause: normalizedError,
                details: {
                    to: mailOptions.to,
                    subject: mailOptions.subject,
                },
            },
        );
    }
}
