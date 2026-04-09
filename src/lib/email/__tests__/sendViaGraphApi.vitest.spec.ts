import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ZodError } from 'zod';

import { type GraphMailConfig, sendViaGraphApi } from '@/lib/email/sendViaGraphApi';
import { ExternalServiceError } from '@/lib/errors';

const { clientSecretCredentialMock, getTokenMock } = vi.hoisted(() => ({
    getTokenMock: vi.fn(),
    clientSecretCredentialMock: vi.fn(),
}));

vi.mock('@azure/identity', () => ({
    ClientSecretCredential: vi.fn(function (this: unknown, ...args: unknown[]) {
        clientSecretCredentialMock(...args);
        return { getToken: getTokenMock };
    }),
}));

const defaultConfig: GraphMailConfig = {
    tenantId: 'tenant-id',
    clientId: 'client-id',
    clientSecret: 'client-secret',
    userPrincipalName: 'sender@example.com',
};

describe('sendViaGraphApi', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        getTokenMock.mockResolvedValue({ token: 'mock-token' });
        vi.spyOn(global, 'fetch').mockResolvedValue(
            new Response(null, { status: 202 }),
        );
    });

    it('authenticates with the correct credentials', async () => {
        await sendViaGraphApi(
            { to: 'player@example.com', subject: 'Test', html: '<p>Hi</p>' },
            defaultConfig,
        );

        expect(clientSecretCredentialMock).toHaveBeenCalledWith(
            'tenant-id',
            'client-id',
            'client-secret',
        );
        expect(getTokenMock).toHaveBeenCalledWith(
            'https://graph.microsoft.com/.default',
        );
    });

    it('sends a properly formatted Graph API request', async () => {
        await sendViaGraphApi(
            {
                to: 'player@example.com',
                cc: 'cc1@example.com,cc2@example.com',
                bcc: 'bcc@example.com',
                subject: 'Game Update',
                html: '<p>Match is on</p>',
            },
            defaultConfig,
        );

        expect(fetch).toHaveBeenCalledWith(
            'https://graph.microsoft.com/v1.0/users/sender%40example.com/sendMail',
            {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer mock-token',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: {
                        subject: 'Game Update',
                        body: {
                            contentType: 'HTML',
                            content: '<p>Match is on</p>',
                        },
                        toRecipients: [
                            { emailAddress: { address: 'player@example.com' } },
                        ],
                        ccRecipients: [
                            { emailAddress: { address: 'cc1@example.com' } },
                            { emailAddress: { address: 'cc2@example.com' } },
                        ],
                        bccRecipients: [
                            { emailAddress: { address: 'bcc@example.com' } },
                        ],
                    },
                    saveToSentItems: false,
                }),
            },
        );
    });

    it('handles empty recipients gracefully', async () => {
        await sendViaGraphApi(
            { subject: 'No recipients', html: '<p>Hello</p>' },
            defaultConfig,
        );

        const fetchCall = vi.mocked(fetch).mock.calls[0];
        const body = JSON.parse(fetchCall[1]!.body as string) as {
            message: { toRecipients: unknown[]; ccRecipients: unknown[]; bccRecipients: unknown[] };
        };

        expect(body.message.toRecipients).toEqual([]);
        expect(body.message.ccRecipients).toEqual([]);
        expect(body.message.bccRecipients).toEqual([]);
    });

    it('throws ExternalServiceError when token acquisition fails', async () => {
        getTokenMock.mockRejectedValue(new Error('Invalid client secret'));

        await expect(
            sendViaGraphApi(
                { to: 'player@example.com', subject: 'Fail', html: '<p>No</p>' },
                defaultConfig,
            ),
        ).rejects.toBeInstanceOf(ExternalServiceError);

        await expect(
            sendViaGraphApi(
                { to: 'player@example.com', subject: 'Fail', html: '<p>No</p>' },
                defaultConfig,
            ),
        ).rejects.toThrow('Graph API authentication failed: Invalid client secret');

        expect(fetch).not.toHaveBeenCalled();
    });

    it('throws ExternalServiceError on non-OK response', async () => {
        vi.spyOn(global, 'fetch').mockResolvedValue(
            new Response('Insufficient privileges', { status: 403 }),
        );

        await expect(
            sendViaGraphApi(
                { to: 'player@example.com', subject: 'Fail', html: '<p>No</p>' },
                defaultConfig,
            ),
        ).rejects.toBeInstanceOf(ExternalServiceError);

        await expect(
            sendViaGraphApi(
                { to: 'player@example.com', subject: 'Fail', html: '<p>No</p>' },
                defaultConfig,
            ),
        ).rejects.toThrow('Graph API sendMail failed (403)');
    });

    it('defaults subject and html to empty strings when omitted', async () => {
        await sendViaGraphApi(
            { to: 'player@example.com' },
            defaultConfig,
        );

        const fetchCall = vi.mocked(fetch).mock.calls[0];
        const body = JSON.parse(fetchCall[1]!.body as string) as {
            message: { subject: string; body: { content: string } };
        };

        expect(body.message.subject).toBe('');
        expect(body.message.body.content).toBe('');
    });

    it('throws ZodError when userPrincipalName is not a valid email', async () => {
        const badConfig: GraphMailConfig = {
            ...defaultConfig,
            userPrincipalName: 'not-an-email',
        };

        await expect(
            sendViaGraphApi(
                { to: 'player@example.com', subject: 'Test', html: '<p>Hi</p>' },
                badConfig,
            ),
        ).rejects.toBeInstanceOf(ZodError);

        expect(clientSecretCredentialMock).not.toHaveBeenCalled();
        expect(fetch).not.toHaveBeenCalled();
    });
});
