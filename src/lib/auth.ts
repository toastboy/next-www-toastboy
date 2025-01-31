import { PrismaClient } from "@prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";

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
    ],
    // socialProviders: {
    //     github: {
    //         clientId: process.env.GITHUB_CLIENT_ID || "",
    //         clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    //     }
    // },
});
