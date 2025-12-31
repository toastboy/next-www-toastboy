import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { admin, customSession } from 'better-auth/plugins';
import prisma from 'prisma/prisma';

import { sendEmail } from '@/actions/sendEmail';
import { getSecrets } from '@/lib/secrets';
import playerEmailService from '@/services/PlayerEmail';

const secrets = getSecrets();

export const auth = betterAuth({
    baseURL: secrets.BETTER_AUTH_URL,
    secret: secrets.BETTER_AUTH_SECRET,
    database: prismaAdapter(prisma, {
        provider: "mysql",
    }),
    user: {
        additionalFields: {
            playerId: {
                type: "number",
                required: false,
                input: false,
            },
        },
    },
    emailAndPassword: {
        enabled: true,
    },
    plugins: [
        admin(),
        customSession(async ({ user, session }) => {
            if (user?.email) {
                const playerEmail = await playerEmailService.getByEmail(user.email, true);

                return {
                    user: {
                        ...user,
                        playerId: playerEmail?.playerId ?? 0,
                    },
                    session,
                };
            }

            return { user, session };
        }),
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
    emailVerification: {
        sendOnSignUp: true,
        // The documentation specifically says that this shouldn't be awaited to
        // avoid timing attacks: https://www.better-auth.com/docs/concepts/email
        // eslint-disable-next-line @typescript-eslint/require-await
        sendVerificationEmail: async ({ user, url }) => {
            const body = `
                <div>
                    <p>
                        Welcome to Toastboy FC!
                    </p>
                    <p>
                        Follow this link to get started:
                        <a href="${url}">confirm your account</a>
                    </p>
                    <p>
                        We look forward to seeing you on the pitch! The games are every Tuesday at 18:00 at Kelsey Kerridge in Cambridge. Please arrive a bit early so you&apos;ve got time to park and pay the day membership.
                    </p>
                    <p>
                        All the details are here:
                        <a href="https://www.toastboy.co.uk/footy/info">Toastboy FC info page</a>
                    </p>
                    <p>
                        Cheers,<br/>
                        Jon
                    </p>
                </div>
            `;

            void sendEmail(
                user.email,
                '',
                'Welcome to Toastboy FC!',
                body,
            );
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
