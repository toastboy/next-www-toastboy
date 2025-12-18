import { adminClient, inferAdditionalFields } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
    appName: "Toastboy FC",
    plugins: [
        adminClient(),
        inferAdditionalFields({
            user: {
                playerId: {
                    type: 'number',
                    required: true,
                },
            },
        }),
    ],
    fetchOptions: {
        throw: true,
    },
});

export const signInWithGoogle = async (callbackURL: string) => {
    return await authClient.signIn.social({
        provider: "google",
        callbackURL: callbackURL,
    });
};

export const signInWithMicrosoft = async (callbackURL: string) => {
    return await authClient.signIn.social({
        provider: "microsoft",
        callbackURL: callbackURL,
    });
};
