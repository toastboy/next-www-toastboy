import { fn } from 'storybook/test';

interface RequestPasswordResetInput {
    email: string;
    redirectTo: string;
}

/**
 * Mocked Better Auth client for Storybook tests.
 */
export const authClient = {
    requestPasswordReset: fn((_input: RequestPasswordResetInput) => Promise.resolve({ status: true })),
    signIn: {
        social: fn((_args: { provider: string; callbackURL: string }) => Promise.resolve({})),
    },
    signInWithEmail: fn((_email: string, _password: string) => Promise.resolve({})),
    signUp: {
        email: fn((_args: { name: string; email: string; password: string }) => Promise.resolve({})),
    },
    useSession: fn(() => ({
        data: null,
        isPending: false,
        isRefetching: false,
        error: null,
        refetch: fn(),
    })),
};

/**
 * Mock social sign-in helper for Google.
 */
export const signInWithGoogle = fn((callbackURL: string) =>
    authClient.signIn.social({ provider: 'google', callbackURL }),
);

/**
 * Mock social sign-in helper for Microsoft.
 */
export const signInWithMicrosoft = fn((callbackURL: string) =>
    authClient.signIn.social({ provider: 'microsoft', callbackURL }),
);
