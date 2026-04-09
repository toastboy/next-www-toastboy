import 'server-only';

import { ClientSecretCredential } from '@azure/identity';
import { z } from 'zod';

import { ExternalServiceError } from '@/lib/errors';

/**
 * Configuration for authenticating with the Microsoft Graph API to send email.
 *
 * Requires an Entra ID (Azure AD) app registration with the `Mail.Send`
 * application permission, granted with admin consent.
 */
export interface GraphMailConfig {
    /** Azure Entra (AD) tenant ID. */
    tenantId: string;
    /** App registration client (application) ID with Mail.Send permission. */
    clientId: string;
    /** App registration client secret value. */
    clientSecret: string;
    /** The mailbox user principal name (email address) to send from. */
    userPrincipalName: string;
}

/**
 * Email payload accepted by {@link sendViaGraphApi}.
 *
 * Recipients are specified as a single email string or a comma-separated list.
 */
export interface GraphMailOptions {
    /** Primary recipient(s) — single email or comma-separated list. */
    to?: string;
    /** CC recipient(s) — single email or comma-separated list. */
    cc?: string;
    /** BCC recipient(s) — single email or comma-separated list. */
    bcc?: string;
    /** Email subject line. */
    subject?: string;
    /** HTML body content. */
    html?: string;
}

/**
 * Zod schema that validates a user principal name as a valid email address.
 *
 * Used to fail fast before constructing the Graph API URL.
 */
const userPrincipalNameSchema = z.email('userPrincipalName must be a valid email address');

/** Graph API recipient object containing an email address. */
interface GraphMailRecipient {
    emailAddress: { address: string };
}

/**
 * Parses a comma-separated recipient string into Graph API recipient objects.
 *
 * Returns an empty array when the input is undefined or empty.
 *
 * @param value - Comma-separated email address string.
 * @returns Array of Graph API formatted recipients.
 */
function parseRecipients(value: string | undefined): GraphMailRecipient[] {
    if (!value) return [];

    return value
        .split(',')
        .map(addr => addr.trim())
        .filter(addr => addr.length > 0)
        .map(address => ({ emailAddress: { address } }));
}

/**
 * Sends an email via the Microsoft Graph API using application permissions.
 *
 * Uses the OAuth2 client-credentials flow to obtain a token, then calls the
 * Graph `sendMail` endpoint for the configured mailbox. The email is not saved
 * to the Sent Items folder.
 *
 * @param options - Email content and recipients.
 * @param config - Graph API credentials and sender configuration.
 * @throws {ExternalServiceError} If the Graph API request fails.
 */
export async function sendViaGraphApi(
    options: GraphMailOptions,
    config: GraphMailConfig,
): Promise<void> {
    userPrincipalNameSchema.parse(config.userPrincipalName);

    const credential = new ClientSecretCredential(
        config.tenantId,
        config.clientId,
        config.clientSecret,
    );

    let token: string;
    try {
        const tokenResponse = await credential.getToken(
            'https://graph.microsoft.com/.default',
        );
        token = tokenResponse.token;
    }
    catch (error) {
        throw new ExternalServiceError(
            `Graph API authentication failed: ${error instanceof Error ? error.message : String(error)}`,
            {
                cause: error instanceof Error ? error : undefined,
                details: {
                    tenantId: config.tenantId,
                    clientId: config.clientId,
                    userPrincipalName: config.userPrincipalName,
                },
            },
        );
    }

    const url = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(config.userPrincipalName)}/sendMail`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: {
                subject: options.subject ?? '',
                body: {
                    contentType: 'HTML',
                    content: options.html ?? '',
                },
                toRecipients: parseRecipients(options.to),
                ccRecipients: parseRecipients(options.cc),
                bccRecipients: parseRecipients(options.bcc),
            },
            saveToSentItems: false,
        }),
    });

    if (!response.ok) {
        let errorBody: string;
        try {
            errorBody = await response.text();
        }
        catch {
            errorBody = '(unable to read response body)';
        }

        throw new ExternalServiceError(
            `Graph API sendMail failed (${response.status}): ${errorBody}`,
            {
                details: {
                    status: response.status,
                    to: options.to,
                    subject: options.subject,
                },
            },
        );
    }
}
