interface RequestPasswordResetInput {
    email: string;
    redirectTo: string;
}

import { vi } from 'vitest';

/**
 * Mocked Better Auth client for Storybook and Vitest tests.
 */
export const authClient = {
    requestPasswordReset: vi.fn((_input: RequestPasswordResetInput) => Promise.resolve({ status: true })),
    resetPassword: vi.fn((_input: { newPassword: string; token?: string }) => Promise.resolve({ status: true })),
    changePassword: vi.fn((_input: { currentPassword: string; newPassword: string; revokeOtherSessions?: boolean }) =>
        Promise.resolve({ status: true })),
    signIn: {
        social: vi.fn((_args: { provider: string; callbackURL: string }) => Promise.resolve({})),
    },
    signInWithEmail: vi.fn((_email: string, _password: string) => Promise.resolve({})),
    signUp: {
        email: vi.fn((_args: { name: string; email: string; password: string }) => Promise.resolve({})),
    },
    useSession: vi.fn(() => ({
        data: null,
        isPending: false,
        isRefetching: false,
        error: null,
        refetch: vi.fn(),
    })),
};

/**
 * Mock social sign-in helper for Google.
 */
export const signInWithGoogle = vi.fn((callbackURL: string) =>
    authClient.signIn.social({ provider: 'google', callbackURL }),
);

/**
 * Mock social sign-in helper for Microsoft.
 */
export const signInWithMicrosoft = vi.fn((callbackURL: string) =>
    authClient.signIn.social({ provider: 'microsoft', callbackURL }),
);
