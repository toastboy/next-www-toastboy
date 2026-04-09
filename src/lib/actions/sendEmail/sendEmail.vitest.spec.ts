import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ExternalServiceError, InternalError } from '@/lib/errors';

const { captureUnexpectedErrorMock, createTransportMock, getSecretsMock, sanitizeHtmlMock, sendMailMock, sendViaGraphApiMock } = vi.hoisted(() => ({
    captureUnexpectedErrorMock: vi.fn(),
    createTransportMock: vi.fn(),
    getSecretsMock: vi.fn(),
    sanitizeHtmlMock: vi.fn(),
    sendMailMock: vi.fn(),
    sendViaGraphApiMock: vi.fn(),
}));

vi.mock('nodemailer', () => ({
    default: {
        createTransport: createTransportMock,
    },
}));

vi.mock('sanitize-html', () => ({
    default: sanitizeHtmlMock,
}));

vi.mock('@/lib/secrets', () => ({
    getSecrets: getSecretsMock,
}));

vi.mock('@/lib/observability/sentry', () => ({
    captureUnexpectedError: captureUnexpectedErrorMock,
}));

vi.mock('@/lib/email/sendViaGraphApi', () => ({
    sendViaGraphApi: sendViaGraphApiMock,
}));

import { sendEmailCore } from '@/lib/actions/sendEmail';

describe('sendEmailCore', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.stubEnv('NODE_ENV', 'test');
        vi.stubEnv('CI', '');
        getSecretsMock.mockReturnValue({
            MAIL_FROM_NAME: 'Mailer',
            MAIL_FROM_ADDRESS: 'mailer@example.com',
            AZURE_TENANT_ID: 'tenant-123',
            MAIL_GRAPH_CLIENT_ID: 'client-123',
            MAIL_GRAPH_CLIENT_SECRET: 'secret-123',
        });
        sanitizeHtmlMock.mockImplementation((value: string) => `sanitized:${value}`);
        sendMailMock.mockResolvedValue(undefined);
        sendViaGraphApiMock.mockResolvedValue(undefined);
        createTransportMock.mockReturnValue({
            sendMail: sendMailMock,
        });
    });

    it('sends sanitized email content using local transport outside production', async () => {
        await sendEmailCore({
            to: 'player@example.com',
            subject: 'Subject',
            html: '<script>bad()</script><p>Hello</p>',
        });

        expect(createTransportMock).toHaveBeenCalledWith({
            host: 'localhost',
            port: 1025,
            secure: false,
        });
        expect(sanitizeHtmlMock).toHaveBeenCalledWith('<script>bad()</script><p>Hello</p>');
        expect(sendMailMock).toHaveBeenCalledWith({
            to: 'player@example.com',
            subject: 'Subject',
            from: '"Mailer" <mailer@example.com>',
            html: 'sanitized:<script>bad()</script><p>Hello</p>',
        });
        expect(sendViaGraphApiMock).not.toHaveBeenCalled();
    });

    it('uses Graph API in production when not running CI', async () => {
        vi.stubEnv('NODE_ENV', 'production');
        vi.stubEnv('CI', '');

        await sendEmailCore({
            to: 'player@example.com',
            subject: 'Production test',
            html: '<p>Hello</p>',
        });

        expect(sendViaGraphApiMock).toHaveBeenCalledWith(
            {
                to: 'player@example.com',
                cc: undefined,
                bcc: undefined,
                subject: 'Production test',
                html: 'sanitized:<p>Hello</p>',
            },
            {
                tenantId: 'tenant-123',
                clientId: 'client-123',
                clientSecret: 'secret-123',
                userPrincipalName: 'mailer@example.com',
            },
        );
        expect(createTransportMock).not.toHaveBeenCalled();
        expect(sendMailMock).not.toHaveBeenCalled();
    });

    it('throws ExternalServiceError when transport send fails', async () => {
        sendMailMock.mockRejectedValue(new Error('SMTP down'));

        await expect(
            sendEmailCore({
                to: 'player@example.com',
                subject: 'Failure',
                html: '<p>Hello</p>',
            }),
        ).rejects.toBeInstanceOf(ExternalServiceError);

        await expect(
            sendEmailCore({
                to: 'player@example.com',
                subject: 'Failure',
                html: '<p>Hello</p>',
            }),
        ).rejects.toThrow('Failed to send email: SMTP down');
        expect(captureUnexpectedErrorMock).toHaveBeenCalledTimes(2);
        expect(captureUnexpectedErrorMock).toHaveBeenNthCalledWith(
            1,
            expect.any(Error),
            expect.objectContaining({
                action: 'sendEmailCore',
                layer: 'server-action',
            }),
        );
    });

    it('throws ExternalServiceError when Graph API fails', async () => {
        vi.stubEnv('NODE_ENV', 'production');
        vi.stubEnv('CI', '');
        sendViaGraphApiMock.mockRejectedValue(
            new ExternalServiceError('Graph API sendMail failed (403): Forbidden'),
        );

        await expect(
            sendEmailCore({
                to: 'player@example.com',
                subject: 'Failure',
                html: '<p>Hello</p>',
            }),
        ).rejects.toBeInstanceOf(ExternalServiceError);

        await expect(
            sendEmailCore({
                to: 'player@example.com',
                subject: 'Failure',
                html: '<p>Hello</p>',
            }),
        ).rejects.toThrow('Graph API sendMail failed (403): Forbidden');
    });

    describe('requireSecret validation in production', () => {
        beforeEach(() => {
            vi.stubEnv('NODE_ENV', 'production');
            vi.stubEnv('CI', '');
        });

        it('throws InternalError when AZURE_TENANT_ID is undefined', async () => {
            getSecretsMock.mockReturnValue({
                MAIL_FROM_NAME: 'Mailer',
                MAIL_FROM_ADDRESS: 'mailer@example.com',
                AZURE_TENANT_ID: undefined,
                MAIL_GRAPH_CLIENT_ID: 'client-123',
                MAIL_GRAPH_CLIENT_SECRET: 'secret-123',
            });

            await expect(
                sendEmailCore({ to: 'player@example.com', subject: 'Test', html: '<p>Hi</p>' }),
            ).rejects.toBeInstanceOf(InternalError);

            await expect(
                sendEmailCore({ to: 'player@example.com', subject: 'Test', html: '<p>Hi</p>' }),
            ).rejects.toThrow('Missing required secret for Graph API email: AZURE_TENANT_ID.');
        });

        it('throws InternalError when MAIL_GRAPH_CLIENT_ID is empty string', async () => {
            getSecretsMock.mockReturnValue({
                MAIL_FROM_NAME: 'Mailer',
                MAIL_FROM_ADDRESS: 'mailer@example.com',
                AZURE_TENANT_ID: 'tenant-123',
                MAIL_GRAPH_CLIENT_ID: '',
                MAIL_GRAPH_CLIENT_SECRET: 'secret-123',
            });

            await expect(
                sendEmailCore({ to: 'player@example.com', subject: 'Test', html: '<p>Hi</p>' }),
            ).rejects.toBeInstanceOf(InternalError);

            await expect(
                sendEmailCore({ to: 'player@example.com', subject: 'Test', html: '<p>Hi</p>' }),
            ).rejects.toThrow('Missing required secret for Graph API email: MAIL_GRAPH_CLIENT_ID.');
        });

        it('throws InternalError when MAIL_GRAPH_CLIENT_SECRET is undefined', async () => {
            getSecretsMock.mockReturnValue({
                MAIL_FROM_NAME: 'Mailer',
                MAIL_FROM_ADDRESS: 'mailer@example.com',
                AZURE_TENANT_ID: 'tenant-123',
                MAIL_GRAPH_CLIENT_ID: 'client-123',
                MAIL_GRAPH_CLIENT_SECRET: undefined,
            });

            await expect(
                sendEmailCore({ to: 'player@example.com', subject: 'Test', html: '<p>Hi</p>' }),
            ).rejects.toBeInstanceOf(InternalError);

            await expect(
                sendEmailCore({ to: 'player@example.com', subject: 'Test', html: '<p>Hi</p>' }),
            ).rejects.toThrow('Missing required secret for Graph API email: MAIL_GRAPH_CLIENT_SECRET.');
        });

        it('passes valid secrets through to Graph API', async () => {
            await sendEmailCore({
                to: 'player@example.com',
                subject: 'Test',
                html: '<p>Hi</p>',
            });

            expect(sendViaGraphApiMock).toHaveBeenCalledWith(
                expect.anything(),
                expect.objectContaining({
                    tenantId: 'tenant-123',
                    clientId: 'client-123',
                    clientSecret: 'secret-123',
                }),
            );
        });
    });
});
