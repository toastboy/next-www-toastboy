import { describe, expect, it, vi } from 'vitest';

// Tests the auth config branches where social provider secrets are absent.
// This file is intentionally isolated from auth.vitest.spec.ts so that
// betterAuth is called here with a fresh module registry and different secrets.

const capturedConfigRef = vi.hoisted(() => ({ value: null as Record<string, unknown> | null }));

vi.hoisted(() => {
    // Ensure NODE_ENV=production so the cookies.secure branch is also covered.
    // Pretty sketchy but this is the only way to test that branch without
    // refactoring the auth module to allow injecting the environment or the
    // config.
    (process.env as Record<string, string>).NODE_ENV = 'production';
});

vi.mock('better-auth', () => ({
    betterAuth: vi.fn((config: Record<string, unknown>) => {
        capturedConfigRef.value = config;
        return { api: {} };
    }),
}));

vi.mock('better-auth/adapters/prisma', () => ({
    prismaAdapter: vi.fn(() => ({})),
}));

vi.mock('better-auth/next-js', () => ({
    nextCookies: vi.fn(() => ({})),
}));

vi.mock('better-auth/plugins', () => ({
    admin: vi.fn(() => ({})),
}));

vi.mock('escape-html', () => ({
    default: (str: string) => str,
}));

vi.mock('prisma/prisma', () => ({
    default: {},
}));

vi.mock('@/actions/deletePlayer', () => ({
    beforeDeletePlayer: vi.fn(),
}));

vi.mock('@/lib/actions/sendEmail', () => ({
    sendEmailCore: vi.fn(),
}));

vi.mock('@/lib/secrets', () => ({
    getSecrets: vi.fn().mockReturnValue({
        BETTER_AUTH_SECRET: 'test-secret',
        // No AUTH_GOOGLE_CLIENT_ID, no AUTH_MICROSOFT_CLIENT_ID, etc.
    }),
}));

vi.mock('@/lib/urls', () => ({
    getPublicBaseUrl: vi.fn().mockReturnValue('https://example.test'),
}));

// Trigger module load with the no-social-provider secrets.
import '@/lib/auth';

describe('auth config — no social providers', () => {
    it('omits google when AUTH_GOOGLE_CLIENT_ID is absent', () => {
        const config = capturedConfigRef.value!;
        const socialProviders = config.socialProviders as Record<string, unknown>;
        expect(socialProviders.google).toBeUndefined();
    });

    it('omits microsoft when AUTH_MICROSOFT_CLIENT_ID is absent', () => {
        const config = capturedConfigRef.value!;
        const socialProviders = config.socialProviders as Record<string, unknown>;
        expect(socialProviders.microsoft).toBeUndefined();
    });

    it('sets secure cookie option to true in production', () => {
        const config = capturedConfigRef.value!;
        const cookies = config.cookies as Record<string, Record<string, Record<string, unknown>>>;
        expect(cookies.sessionToken.options.secure).toBe(true);
    });
});
