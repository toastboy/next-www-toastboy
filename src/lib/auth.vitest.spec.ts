import { beforeEach, describe, expect, it, vi } from 'vitest';

const capturedConfigRef = vi.hoisted(() => ({ value: null as Record<string, unknown> | null }));

const { sendEmailCoreMock, beforeDeletePlayerMock, getSecretsMock, getPublicBaseUrlMock } = vi.hoisted(() => ({
    sendEmailCoreMock: vi.fn().mockResolvedValue(undefined),
    beforeDeletePlayerMock: vi.fn().mockResolvedValue(undefined),
    getSecretsMock: vi.fn().mockReturnValue({
        BETTER_AUTH_SECRET: 'test-secret',
        AUTH_GOOGLE_CLIENT_ID: 'google-id',
        AUTH_GOOGLE_CLIENT_SECRET: 'google-secret',
        AUTH_MICROSOFT_CLIENT_ID: 'ms-id',
        AUTH_MICROSOFT_CLIENT_SECRET: 'ms-secret',
        AZURE_TENANT_ID: 'tenant-id',
    }),
    getPublicBaseUrlMock: vi.fn().mockReturnValue('https://example.test'),
}));

vi.mock('better-auth', () => ({
    betterAuth: vi.fn((config: Record<string, unknown>) => {
        capturedConfigRef.value = config;
        return { api: {} };
    }),
}));

vi.mock('better-auth/adapters/prisma', () => ({
    prismaAdapter: vi.fn(() => ({})),
}));

vi.mock('better-auth/next-js', () => ({
    nextCookies: vi.fn(() => ({})),
}));

vi.mock('better-auth/plugins', () => ({
    admin: vi.fn(() => ({})),
}));

vi.mock('escape-html', () => ({
    default: (str: string) => str,
}));

vi.mock('prisma/prisma', () => ({
    default: {},
}));

vi.mock('@/actions/deletePlayer', () => ({
    beforeDeletePlayer: beforeDeletePlayerMock,
}));

vi.mock('@/lib/actions/sendEmail', () => ({
    sendEmailCore: sendEmailCoreMock,
}));

vi.mock('@/lib/secrets', () => ({
    getSecrets: getSecretsMock,
}));

vi.mock('@/lib/urls', () => ({
    getPublicBaseUrl: getPublicBaseUrlMock,
}));

// Trigger module load so betterAuth is called and config is captured.
import '@/lib/auth';

type AnyFn = (...args: unknown[]) => unknown;

function getCallback<T>(...path: string[]): T {
    let node = capturedConfigRef.value!;
    for (const key of path) {
        node = node[key] as Record<string, unknown>;
    }
    return node as T;
}

describe('auth config callbacks', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('user.changeEmail.sendChangeEmailConfirmation', () => {
        const getCallback_ = () => getCallback<AnyFn>('user', 'changeEmail', 'sendChangeEmailConfirmation');

        it('sends a confirmation email when user.email is set', async () => {
            await getCallback_()({
                user: { email: 'old@example.com' },
                newEmail: 'new@example.com',
                url: 'https://example.test/confirm',
            });

            expect(sendEmailCoreMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    to: 'old@example.com',
                    subject: 'Confirm your Toastboy FC email change',
                    html: expect.stringContaining('new@example.com') as unknown,
                }),
            );
        });

        it('skips sending when user.email is absent', async () => {
            await getCallback_()({
                user: { email: undefined },
                newEmail: 'new@example.com',
                url: 'https://example.test/confirm',
            });

            expect(sendEmailCoreMock).not.toHaveBeenCalled();
        });
    });

    describe('user.deleteUser.sendDeleteAccountVerification', () => {
        const getCallback_ = () => getCallback<AnyFn>('user', 'deleteUser', 'sendDeleteAccountVerification');

        it('sends a delete account email', async () => {
            await getCallback_()({
                user: { email: 'user@example.com' },
                url: 'https://example.test/delete',
                token: 'tok',
            });

            expect(sendEmailCoreMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    to: 'user@example.com',
                    subject: 'Delete your Toastboy FC account',
                    html: expect.stringContaining('Delete account') as unknown,
                }),
            );
        });
    });

    describe('user.deleteUser.beforeDelete', () => {
        it('calls beforeDeletePlayer with the user object', async () => {
            const cb = getCallback<AnyFn>('user', 'deleteUser', 'beforeDelete');
            const user = { id: '1', name: 'Alex', email: 'alex@example.com', playerId: 42 };

            await cb(user);

            expect(beforeDeletePlayerMock).toHaveBeenCalledWith(user);
        });
    });

    describe('emailAndPassword.sendResetPassword', () => {
        it('fires sendEmailCore (void, not awaited) with password reset email', async () => {
            const cb = getCallback<AnyFn>('emailAndPassword', 'sendResetPassword');

            await cb({ user: { email: 'user@example.com' }, url: 'https://example.test/reset' });

            expect(sendEmailCoreMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    to: 'user@example.com',
                    subject: 'Reset your Toastboy FC password',
                    html: expect.stringContaining('Reset password') as unknown,
                }),
            );
        });
    });

    describe('emailAndPassword.onPasswordReset', () => {
        it('resolves without calling any email service', async () => {
            const cb = getCallback<AnyFn>('emailAndPassword', 'onPasswordReset');

            await expect(cb()).resolves.toBeUndefined();
            expect(sendEmailCoreMock).not.toHaveBeenCalled();
        });
    });

    describe('emailVerification.sendVerificationEmail', () => {
        const getCallback_ = () => getCallback<AnyFn>('emailVerification', 'sendVerificationEmail');

        it('sends a verification email when user.email is set', async () => {
            await getCallback_()({
                user: { email: 'user@example.com' },
                url: 'https://example.test/verify',
                token: 'tok',
            });

            expect(sendEmailCoreMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    to: 'user@example.com',
                    subject: 'Verify your Toastboy FC email address',
                    html: expect.stringContaining('Verify email') as unknown,
                }),
            );
        });

        it('skips sending when user.email is absent', async () => {
            await getCallback_()({
                user: { email: undefined },
                url: 'https://example.test/verify',
                token: 'tok',
            });

            expect(sendEmailCoreMock).not.toHaveBeenCalled();
        });
    });

    describe('deleteUser.sendDeleteAccountVerification', () => {
        const getCallback_ = () => getCallback<AnyFn>('deleteUser', 'sendDeleteAccountVerification');

        it('fires sendEmailCore when user.email is set', async () => {
            await getCallback_()({
                user: { email: 'user@example.com' },
                url: 'https://example.test/delete',
                token: 'tok',
            });

            expect(sendEmailCoreMock).toHaveBeenCalled();
        });

        it('skips sending when user.email is absent', async () => {
            await getCallback_()({
                user: { email: undefined },
                url: 'https://example.test/delete',
                token: 'tok',
            });

            expect(sendEmailCoreMock).not.toHaveBeenCalled();
        });
    });
});
