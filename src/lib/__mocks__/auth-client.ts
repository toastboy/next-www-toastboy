interface RequestPasswordResetInput {
    email: string;
    redirectTo: string;
}

interface StorybookFnRegistry {
    __STORYBOOK_FN__?: MockFn;
}

/**
 * Resolve the mock function creator for Jest or Storybook runtimes.
 */
const getMockFn = () => {
    if (typeof jest !== 'undefined' && typeof jest.fn === 'function') {
        return jest.fn as MockFn;
    }

    const storybookFn = (globalThis as StorybookFnRegistry).__STORYBOOK_FN__;
    if (typeof storybookFn === 'function') {
        return storybookFn;
    }

    return ((implementation) => implementation ?? (() => undefined)) as MockFn;
};

type MockFn = <TArgs extends unknown[], TResult>(
    implementation?: (...args: TArgs) => TResult,
) => (...args: TArgs) => TResult;

const mockFn = getMockFn();

/**
 * Mocked Better Auth client for Storybook and Jest tests.
 */
export const authClient = {
    requestPasswordReset: mockFn((_input: RequestPasswordResetInput) => Promise.resolve({ status: true })),
    resetPassword: mockFn((_input: { newPassword: string; token?: string }) => Promise.resolve({ status: true })),
    changePassword: mockFn((_input: { currentPassword: string; newPassword: string; revokeOtherSessions?: boolean }) => Promise.resolve({ status: true })),
    signIn: {
        social: mockFn((_args: { provider: string; callbackURL: string }) => Promise.resolve({})),
    },
    signInWithEmail: mockFn((_email: string, _password: string) => Promise.resolve({})),
    signUp: {
        email: mockFn((_args: { name: string; email: string; password: string }) => Promise.resolve({})),
    },
    useSession: mockFn(() => ({
        data: null,
        isPending: false,
        isRefetching: false,
        error: null,
        refetch: mockFn(),
    })),
};

/**
 * Mock social sign-in helper for Google.
 */
export const signInWithGoogle = mockFn((callbackURL: string) =>
    authClient.signIn.social({ provider: 'google', callbackURL }),
);

/**
 * Mock social sign-in helper for Microsoft.
 */
export const signInWithMicrosoft = mockFn((callbackURL: string) =>
    authClient.signIn.social({ provider: 'microsoft', callbackURL }),
);
