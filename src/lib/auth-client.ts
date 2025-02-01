import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "./auth";

export const authClient = createAuthClient({
    appName: "Toastboy FC",
    plugins: [
        adminClient(),
        inferAdditionalFields<typeof auth>(),
    ],
    baseURL: process.env.BETTER_AUTH_URL,
});

export const signInWithGoogle = async () => {
    return await authClient.signIn.social({
        provider: "google",
    });
};

export const signInWithMicrosoft = async () => {
    return await authClient.signIn.social({
        provider: "microsoft",
    });
};
