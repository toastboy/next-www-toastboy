import { PrismaClient } from "@prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin, customSession } from "better-auth/plugins";

const prisma = new PrismaClient();
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "mysql",
    }),
    user: {
        additionalFields: {
            playerId: {
                type: "number",
                required: true,
                defaultValue: 0,
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
                        playerId: player?.id || 0,
                    },
                    session,
                };
            }

            return { user, session };
        }),
    ],
    // TODO: Add social providers
    // socialProviders: {
    //     github: {
    //         clientId: process.env.GITHUB_CLIENT_ID || "",
    //         clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    //     }
    // },
});

export type Session = typeof auth.$Infer.Session;
