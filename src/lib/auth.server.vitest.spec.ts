import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AuthError } from '@/lib/errors';

// Mock the auth module to avoid touching the real Better Auth instance
const { headersMock, getSessionMock } = vi.hoisted(() => ({
    headersMock: vi.fn().mockResolvedValue(new Headers()),
    getSessionMock: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({
    auth: {
        api: {
            getSession: getSessionMock,
        },
    },
}));

vi.mock('next/headers', () => ({
    headers: headersMock,
}));

import {
    isMockAuthEnabled,
    requireAdmin,
    requireUser,
} from '@/lib/auth.server';

describe('isMockAuthEnabled', () => {
    const originalEnv = process.env.NODE_ENV;

    afterEach(() => {
        // @ts-expect-error -- NODE_ENV is read-only in types but writable at runtime
        process.env.NODE_ENV = originalEnv;
    });

    it('returns true in development', () => {
        // @ts-expect-error -- NODE_ENV is read-only in types but writable at runtime
        process.env.NODE_ENV = 'development';

        expect(isMockAuthEnabled()).toBe(true);
    });

    it('returns true in test', () => {
        // @ts-expect-error -- NODE_ENV is read-only in types but writable at runtime
        process.env.NODE_ENV = 'test';

        expect(isMockAuthEnabled()).toBe(true);
    });

    it('returns false in production', () => {
        // @ts-expect-error -- NODE_ENV is read-only in types but writable at runtime
        process.env.NODE_ENV = 'production';

        expect(isMockAuthEnabled()).toBe(false);
    });
});

describe('requireAdmin', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Default: no mock auth cookies
        headersMock.mockResolvedValue(new Headers());
    });

    it('resolves when the user is an admin', async () => {
        getSessionMock.mockResolvedValue({
            user: { role: 'admin' },
        });

        await expect(requireAdmin()).resolves.toBeUndefined();
    });

    it('throws AuthError for authenticated non-admin users', async () => {
        getSessionMock.mockResolvedValue({
            user: { role: 'user' },
        });

        await expect(requireAdmin()).rejects.toThrow(AuthError);
        await expect(requireAdmin()).rejects.toThrow(/admin/i);
    });

    it('throws AuthError for unauthenticated users', async () => {
        getSessionMock.mockResolvedValue(null);

        await expect(requireAdmin()).rejects.toThrow(AuthError);
        await expect(requireAdmin()).rejects.toThrow(/logged in/i);
    });
});

describe('requireUser', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        headersMock.mockResolvedValue(new Headers());
    });

    it('resolves when the user is an admin', async () => {
        getSessionMock.mockResolvedValue({
            user: { role: 'admin' },
        });

        await expect(requireUser()).resolves.toBeUndefined();
    });

    it('resolves when the user is a regular user', async () => {
        getSessionMock.mockResolvedValue({
            user: { role: 'user' },
        });

        await expect(requireUser()).resolves.toBeUndefined();
    });

    it('throws AuthError for unauthenticated users', async () => {
        getSessionMock.mockResolvedValue(null);

        await expect(requireUser()).rejects.toThrow(AuthError);
        await expect(requireUser()).rejects.toThrow(/logged in/i);
    });
});
