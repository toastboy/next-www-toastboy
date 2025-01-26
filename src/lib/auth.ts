import { PrismaClient } from "@prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin, customSession } from "better-auth/plugins";

const prisma = new PrismaClient();
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "mysql",
    }),
    emailAndPassword: {
        enabled: true,
    },
    plugins: [
        admin(),
        customSession(async ({ user, session }) => {
            if (user?.email) {
                const player = await prisma.player.findMany({
                    where: {
                        email: {
                            contains: user.email,
                        },
                    },
                });

                if (player.length > 0) {
                    return {
                        player: player[0],
                        user: {
                            ...user,
                            playerId: player[0].id,
                        },
                        session,
                    };
                }
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
