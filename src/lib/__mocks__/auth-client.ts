interface RequestPasswordResetInput {
    email: string;
    redirectTo: string;
}

type SpyFactory = <T extends (...args: unknown[]) => unknown>(
    implementation?: T,
) => T & { mock?: unknown };

const getSpyFactory = (): SpyFactory => {
    if (typeof globalThis !== 'undefined') {
        const storybookFn = (globalThis as Record<string, unknown>).__STORYBOOK_FN__;
        if (typeof storybookFn === 'function') {
            return storybookFn as SpyFactory;
        }

        const vitestFn = (globalThis as { vi?: { fn?: SpyFactory } }).vi?.fn;
        if (vitestFn) {
            return vitestFn;
        }
    }

    return ((implementation?: (...args: unknown[]) => unknown) =>
        ((...args: unknown[]) => implementation?.(...args)) as unknown) as SpyFactory;
};

const spy = getSpyFactory();

/**
 * Mocked Better Auth client for Storybook and Vitest tests.
 */
export const authClient = {
    requestPasswordReset: spy((_input: RequestPasswordResetInput) => Promise.resolve({ status: true })),
    resetPassword: spy((_input: { newPassword: string; token?: string }) => Promise.resolve({ status: true })),
    changePassword: spy((_input: { currentPassword: string; newPassword: string; revokeOtherSessions?: boolean }) =>
        Promise.resolve({ status: true })),
    signIn: {
        social: spy((_args: { provider: string; callbackURL: string }) => Promise.resolve({})),
    },
    signInWithEmail: spy((_email: string, _password: string) => Promise.resolve({})),
    signUp: {
        email: spy((_args: { name: string; email: string; password: string }) => Promise.resolve({})),
    },
    useSession: spy(() => ({
        data: null,
        isPending: false,
        isRefetching: false,
        error: null,
        refetch: spy(),
    })),
};

/**
 * Mock social sign-in helper for Google.
 */
export const signInWithGoogle = spy((callbackURL: string) =>
    authClient.signIn.social({ provider: 'google', callbackURL }),
);

/**
 * Mock social sign-in helper for Microsoft.
 */
export const signInWithMicrosoft = spy((callbackURL: string) =>
    authClient.signIn.social({ provider: 'microsoft', callbackURL }),
);
