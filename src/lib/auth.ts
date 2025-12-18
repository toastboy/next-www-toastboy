import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { admin, customSession } from 'better-auth/plugins';
import prisma from 'lib/prisma';
import { getSecrets } from 'lib/secrets';

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
                const player = await prisma.player.findFirst({
                    where: {
                        email: {
                            contains: user.email,
                        },
                    },
                });

                return {
                    user: {
                        ...user,
                        playerId: player?.id ?? 0,
                    },
                    session,
                };
            }

            return { user, session };
        }),
        nextCookies(), // Must be last: see https://better-auth.vercel.app/docs/integrations/next#server-action-cookies
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
