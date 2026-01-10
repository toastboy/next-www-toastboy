import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { admin } from 'better-auth/plugins';
import prisma from 'prisma/prisma';

import { sendEmail } from '@/actions/sendEmail';
import { getSecrets } from '@/lib/secrets';
import { getPublicBaseUrl } from '@/lib/urls';

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
        deleteUser: {
            enabled: true,
            sendDeleteAccountVerification: async ({ user, url }, _request) => {
                await sendEmail(
                    user.email,
                    '',
                    'Delete your Toastboy FC account',
                    [
                        `<p>Click the link to confirm your account deletion:</p>`,
                        `<a href="${url}">Delete account</a>`,
                    ].join(''),
                );
            },
        },
    },
    emailAndPassword: {
        enabled: true,
        // The documentation specifically says that this shouldn't be awaited to
        // avoid timing attacks: https://www.better-auth.com/docs/concepts/email
        // eslint-disable-next-line @typescript-eslint/require-await
        sendResetPassword: async ({ user, url }, _request) => {
            void sendEmail(
                user.email,
                '',
                'Reset your Toastboy FC password',
                [
                    `<p>Click the link to reset your password:</p>`,
                    `<a href="${url}">Reset password</a>`,
                ].join(''),
            );
        },
        // eslint-disable-next-line @typescript-eslint/require-await
        onPasswordReset: async ({ user }, _request) => {
            console.error(`Password for user ${user.email} has been reset.`);
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
                void sendEmail(
                    user.email,
                    '',
                    'Reset your Toastboy FC password',
                    [
                        `<p>Click the link to reset your password:</p>`,
                        `<a href="${url}">Reset password</a>`,
                    ].join(''),
                );
            }
        },
    },
    plugins: [
        admin(),
        // Must be last: see https://better-auth.vercel.app/docs/integrations/next#server-action-cookies
        nextCookies(),
    ],
    socialProviders: {
        ...{
            google: secrets.GOOGLE_CLIENT_ID && secrets.GOOGLE_CLIENT_SECRET ? {
                clientId: secrets.GOOGLE_CLIENT_ID,
                clientSecret: secrets.GOOGLE_CLIENT_SECRET,
            } : undefined,
        },
        ...{
            microsoft: secrets.MICROSOFT_CLIENT_ID && secrets.MICROSOFT_CLIENT_SECRET ? {
                clientId: secrets.MICROSOFT_CLIENT_ID,
                clientSecret: secrets.MICROSOFT_CLIENT_SECRET,
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
