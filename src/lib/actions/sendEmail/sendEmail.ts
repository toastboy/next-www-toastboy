import 'server-only';

import nodemailer, { type SendMailOptions } from 'nodemailer';
import sanitizeHtml from 'sanitize-html';

import { sendViaGraphApi } from '@/lib/email/sendViaGraphApi';
import { ExternalServiceError, InternalError, normalizeUnknownError } from '@/lib/errors';
import { captureUnexpectedError } from '@/lib/observability/sentry';
import { getSecrets } from '@/lib/secrets';

/**
 * Asserts that a secret value is defined, throwing an {@link InternalError}
 * with a descriptive message if it is missing.
 *
 * @param name - The secret name, used in the error message.
 * @param value - The secret value to validate.
 * @returns The validated non-empty string value.
 * @throws {InternalError} If the value is undefined or empty.
 */
function requireSecret(name: string, value: string | undefined): string {
    if (!value) {
        throw new InternalError(`Missing required secret for Graph API email: ${name}.`, {
            details: { secretName: name },
        });
    }
    return value;
}

/**
 * Converts a nodemailer recipient field to a plain comma-separated string.
 *
 * Handles `string`, `Address` objects, and arrays of both. Returns `undefined`
 * when the input is falsy.
 *
 * @param value - A nodemailer-style recipient value.
 * @returns A comma-separated email string, or `undefined`.
 */
function recipientToString(
    value: SendMailOptions['to'],
): string | undefined {
    if (!value) return undefined;
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) {
        return value
            .map(v => (typeof v === 'string' ? v : v.address))
            .join(',');
    }
    return value.address;
}

/**
 * Sends an email using the configured transport.
 *
 * In production, uses the Microsoft Graph API with client-credentials OAuth2.
 * In development and CI, uses a local SMTP server (e.g. MailPit on port 1025).
 * HTML content is sanitized before sending in both cases.
 *
 * @param mailOptions - Nodemailer mail options payload.
 * @throws {ExternalServiceError} If email delivery fails.
 */
export async function sendEmailCore(mailOptions: SendMailOptions) {
    const secrets = getSecrets();

    const sanitizedHtml =
        typeof mailOptions.html === 'string' ?
            sanitizeHtml(mailOptions.html) :
            mailOptions.html ?? undefined;

    try {
        if (process.env.NODE_ENV === 'production' && !process.env.CI) {
            await sendViaGraphApi(
                {
                    to: recipientToString(mailOptions.to),
                    cc: recipientToString(mailOptions.cc),
                    bcc: recipientToString(mailOptions.bcc),
                    subject: mailOptions.subject,
                    html: typeof sanitizedHtml === 'string' ? sanitizedHtml : undefined,
                },
                {
                    tenantId: requireSecret('AZURE_TENANT_ID', secrets.AZURE_TENANT_ID),
                    clientId: requireSecret('MAIL_GRAPH_CLIENT_ID', secrets.MAIL_GRAPH_CLIENT_ID),
                    clientSecret: requireSecret('MAIL_GRAPH_CLIENT_SECRET', secrets.MAIL_GRAPH_CLIENT_SECRET),
                    userPrincipalName: secrets.MAIL_FROM_ADDRESS,
                },
            );
        }
        else {
            const transporter = nodemailer.createTransport({
                host: 'localhost',
                port: 1025,
                secure: false,
            });

            await transporter.sendMail({
                ...mailOptions,
                from: `"${secrets.MAIL_FROM_NAME}" <${secrets.MAIL_FROM_ADDRESS}>`,
                ...(sanitizedHtml !== undefined ? { html: sanitizedHtml } : {}),
            });
        }
    }
    catch (error) {
        if (error instanceof ExternalServiceError || error instanceof InternalError) {
            throw error;
        }

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
