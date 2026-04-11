
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { admin } from 'better-auth/plugins';
import escapeHtml from 'escape-html';
import prisma from 'prisma/prisma';

import { beforeDeletePlayer } from '@/actions/deletePlayer';
import { sendEmailCore } from '@/lib/actions/sendEmail';
import { getSecrets } from '@/lib/secrets';
import { getPublicBaseUrl } from '@/lib/urls';
import { AuthUserSummary } from '@/types/AuthUser';

const secrets = getSecrets();

// For some reason while sendResetPassword is properly typed, the
// sendDeleteAccountVerification just has a bunch of 'any's
interface DeleteAccountVerificationContext {
    user: {
        email?: string;
    };
    url: string;
    token: string;
}

/**
 * Context supplied by Better Auth when confirming an email-change request.
 */
interface ChangeEmailConfirmationContext {
    user: {
        email?: string;
    };
    newEmail: string;
    url: string;
    token: string;
}

/**
 * Context supplied by Better Auth when sending a verification email.
 */
interface EmailVerificationContext {
    user: {
        email?: string;
    };
    url: string;
    token: string;
}

export const auth = betterAuth({
    baseURL: getPublicBaseUrl(),
    secret: secrets.BETTER_AUTH_SECRET,
    database: prismaAdapter(prisma, {
        provider: "mysql",
    }),
    user: {
        additionalFields: {
            playerId: {
                type: "number",
                required: false,
            },
        },
        changeEmail: {
            enabled: true,
            sendChangeEmailConfirmation: async ({ user, newEmail, url }: ChangeEmailConfirmationContext) => {
                if (user.email) {
                    const safeNewEmail = escapeHtml(newEmail);
                    const safeUrl = escapeHtml(url);

                    await sendEmailCore({
                        to: user.email,
                        subject: 'Confirm your Toastboy FC email change',
                        html: [
                            `<p>We received a request to change your login email to ${safeNewEmail}.</p>`,
                            `<p>If this was you, confirm the change:</p>`,
                            `<a href="${safeUrl}">Confirm email change</a>`,
                        ].join(''),
                    });
                }
            },
        },
        deleteUser: {
            enabled: true,
            sendDeleteAccountVerification: async ({ user, url }, _request) => {
                const safeUrl = escapeHtml(url);

                await sendEmailCore({
                    to: user.email,
                    subject: 'Delete your Toastboy FC account',
                    html: [
                        `<p>Click the link to confirm your account deletion:</p>`,
                        `<a href="${safeUrl}">Delete account</a>`,
                    ].join(''),
                });
            },
            beforeDelete: async (user) => {
                await beforeDeletePlayer(user as unknown as AuthUserSummary);
            },
        },
    },
    emailAndPassword: {
        enabled: true,
        // The documentation specifically says that this shouldn't be awaited to
        // avoid timing attacks: https://www.better-auth.com/docs/concepts/email
        // eslint-disable-next-line @typescript-eslint/require-await
        sendResetPassword: async ({ user, url }, _request) => {
            const safeUrl = escapeHtml(url);

            void sendEmailCore({
                to: user.email,
                subject: 'Reset your Toastboy FC password',
                html: [
                    `<p>Click the link to reset your password:</p>`,
                    `<a href="${safeUrl}">Reset password</a>`,
                ].join(''),
            });
        },
        onPasswordReset: async () => {
            // Intentionally left blank.
        },
    },
    emailVerification: {
        sendVerificationEmail: async ({ user, url }: EmailVerificationContext) => {
            if (user.email) {
                const safeUrl = escapeHtml(url);

                await sendEmailCore({
                    to: user.email,
                    subject: 'Verify your Toastboy FC email address',
                    html: [
                        `<p>Click the link to verify your email address:</p>`,
                        `<a href="${safeUrl}">Verify email</a>`,
                    ].join(''),
                });
            }
        },
    },
    deleteUser: {
        enabled: true,
        // The documentation specifically says that this shouldn't be awaited to
        // avoid timing attacks: https://www.better-auth.com/docs/concepts/users-accounts
        // eslint-disable-next-line @typescript-eslint/require-await
        sendDeleteAccountVerification: async (
            { user, url, token: _token }: DeleteAccountVerificationContext,
            _request: Request | undefined,
        ) => {
            if (user.email) {
                const safeUrl = escapeHtml(url);

                void sendEmailCore({
                    to: user.email,
                    subject: 'Reset your Toastboy FC password',
                    html: [
                        `<p>Click the link to reset your password:</p>`,
                        `<a href="${safeUrl}">Reset password</a>`,
                    ].join(''),
                });
            }
        },
    },
    account: {
        accountLinking: {
            enabled: true,
            trustedProviders: ["google", "microsoft"],
        },
    },
    plugins: [
        admin(),
        // Must be last: see https://better-auth.vercel.app/docs/integrations/next#server-action-cookies
        nextCookies(),
    ],
    socialProviders: {
        ...{
            google: secrets.AUTH_GOOGLE_CLIENT_ID && secrets.AUTH_GOOGLE_CLIENT_SECRET ? {
                clientId: secrets.AUTH_GOOGLE_CLIENT_ID,
                clientSecret: secrets.AUTH_GOOGLE_CLIENT_SECRET,
            } : undefined,
        },
        ...{
            microsoft: secrets.AUTH_MICROSOFT_CLIENT_ID && secrets.AUTH_MICROSOFT_CLIENT_SECRET ? {
                clientId: secrets.AUTH_MICROSOFT_CLIENT_ID,
                clientSecret: secrets.AUTH_MICROSOFT_CLIENT_SECRET,
                tenantId: secrets.AZURE_TENANT_ID,
            } : undefined,
        },
    },
    cookies: {
        sessionToken: {
            name: "__Secure-authjs.session-token",
            options: {
                httpOnly: true,
                sameSite: "lax", // Important to avoid browser restrictions
                secure: process.env.NODE_ENV === "production",
            },
        },
    },
});

export type Session = typeof auth.$Infer.Session;
