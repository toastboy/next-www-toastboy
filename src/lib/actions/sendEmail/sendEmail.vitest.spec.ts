import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ExternalServiceError } from '@/lib/errors';

const { createTransportMock, getSecretsMock, sanitizeHtmlMock, sendMailMock } = vi.hoisted(() => ({
    createTransportMock: vi.fn(),
    getSecretsMock: vi.fn(),
    sanitizeHtmlMock: vi.fn(),
    sendMailMock: vi.fn(),
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

import { sendEmailCore } from '@/lib/actions/sendEmail';

describe('sendEmailCore', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.stubEnv('NODE_ENV', 'test');
        vi.stubEnv('CI', '');
        getSecretsMock.mockReturnValue({
            MAIL_FROM_NAME: 'Mailer',
            MAIL_FROM_ADDRESS: 'mailer@example.com',
            SMTP_HOST: 'smtp.example.com',
        });
        sanitizeHtmlMock.mockImplementation((value: string) => `sanitized:${value}`);
        sendMailMock.mockResolvedValue(undefined);
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
    });

    it('uses configured SMTP host in production when not running CI', async () => {
        vi.stubEnv('NODE_ENV', 'production');
        vi.stubEnv('CI', '');

        await sendEmailCore({
            to: 'player@example.com',
            subject: 'Production test',
            html: '<p>Hello</p>',
        });

        expect(createTransportMock).toHaveBeenCalledWith({
            host: 'smtp.example.com',
            port: 25,
            secure: false,
        });
    });

    it('throws ExternalServiceError when transport send fails', async () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
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

        consoleErrorSpy.mockRestore();
    });
});
