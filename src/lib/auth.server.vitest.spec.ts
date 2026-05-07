import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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
    getCurrentUser,
    getMockAuthState,
    getMockUsersList,
    getUserRole,
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

    it('returns true in production when PLAYWRIGHT_TEST is true', () => {
        // @ts-expect-error -- NODE_ENV is read-only in types but writable at runtime
        process.env.NODE_ENV = 'production';
        vi.stubEnv('PLAYWRIGHT_TEST', 'true');

        expect(isMockAuthEnabled()).toBe(true);
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

describe('getMockAuthState', () => {
    beforeEach(() => {
        vi.unstubAllEnvs();
        headersMock.mockResolvedValue(new Headers());
    });

    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it('returns none in production regardless of cookies', async () => {
        vi.stubEnv('NODE_ENV', 'production');
        headersMock.mockResolvedValue(new Headers({ cookie: 'mock-auth-state=admin' }));

        await expect(getMockAuthState()).resolves.toBe('none');
    });

    it('returns admin when cookie is mock-auth-state=admin', async () => {
        headersMock.mockResolvedValue(new Headers({ cookie: 'mock-auth-state=admin' }));

        await expect(getMockAuthState()).resolves.toBe('admin');
    });

    it('returns user when cookie is mock-auth-state=user', async () => {
        headersMock.mockResolvedValue(new Headers({ cookie: 'mock-auth-state=user' }));

        await expect(getMockAuthState()).resolves.toBe('user');
    });

    it('returns none when cookie has an unrecognised value', async () => {
        headersMock.mockResolvedValue(new Headers({ cookie: 'mock-auth-state=superuser' }));

        await expect(getMockAuthState()).resolves.toBe('none');
    });

    it('returns none when no cookie is present', async () => {
        await expect(getMockAuthState()).resolves.toBe('none');
    });

    it('ignores empty cookie segments caused by double semicolons', async () => {
        headersMock.mockResolvedValue(new Headers({ cookie: ';;mock-auth-state=admin;;' }));

        await expect(getMockAuthState()).resolves.toBe('admin');
    });

    it('ignores cookie segments that have no name (start with =)', async () => {
        headersMock.mockResolvedValue(new Headers({ cookie: '=orphan; mock-auth-state=user' }));

        await expect(getMockAuthState()).resolves.toBe('user');
    });
});

describe('getMockUsersList', () => {
    it('returns the two default mock users', () => {
        const users = getMockUsersList();

        expect(users).toHaveLength(2);
        expect(users[0]).toMatchObject({ email: 'testuser@example.com', role: 'user' });
        expect(users[1]).toMatchObject({ email: 'testadmin@example.com', role: 'admin' });
    });
});

describe('getUserRole', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        headersMock.mockResolvedValue(new Headers());
    });

    it('returns admin when mock auth state is admin', async () => {
        headersMock.mockResolvedValue(new Headers({ cookie: 'mock-auth-state=admin' }));

        await expect(getUserRole()).resolves.toBe('admin');
        expect(getSessionMock).not.toHaveBeenCalled();
    });

    it('returns user when mock auth state is user', async () => {
        headersMock.mockResolvedValue(new Headers({ cookie: 'mock-auth-state=user' }));

        await expect(getUserRole()).resolves.toBe('user');
        expect(getSessionMock).not.toHaveBeenCalled();
    });

    it('returns admin when session has admin role', async () => {
        getSessionMock.mockResolvedValue({ user: { role: 'admin' } });

        await expect(getUserRole()).resolves.toBe('admin');
    });

    it('returns user when session has a non-admin role', async () => {
        getSessionMock.mockResolvedValue({ user: { role: 'user' } });

        await expect(getUserRole()).resolves.toBe('user');
    });

    it('returns none when there is no session', async () => {
        getSessionMock.mockResolvedValue(null);

        await expect(getUserRole()).resolves.toBe('none');
    });
});

describe('getCurrentUser', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        headersMock.mockResolvedValue(new Headers());
    });

    it('returns the mock user when mock auth state is active', async () => {
        headersMock.mockResolvedValue(new Headers({ cookie: 'mock-auth-state=user' }));

        const user = await getCurrentUser();

        expect(user).toMatchObject({ name: 'Test User', email: 'testuser@example.com', role: 'user' });
        expect(getSessionMock).not.toHaveBeenCalled();
    });

    it('returns the mock admin when mock auth state is admin', async () => {
        headersMock.mockResolvedValue(new Headers({ cookie: 'mock-auth-state=admin' }));

        const user = await getCurrentUser();

        expect(user).toMatchObject({ name: 'Test Admin', role: 'admin' });
    });

    it('merges custom mock-auth-user cookie fields over defaults', async () => {
        const custom = encodeURIComponent(JSON.stringify({ playerId: 99, name: 'Custom' }));
        headersMock.mockResolvedValue(new Headers({ cookie: `mock-auth-state=user; mock-auth-user=${custom}` }));

        const user = await getCurrentUser();

        expect(user?.playerId).toBe(99);
        expect(user?.name).toBe('Custom');
        expect(user?.role).toBe('user');
    });

    it('falls back to defaults when mock-auth-user cookie has invalid JSON', async () => {
        headersMock.mockResolvedValue(new Headers({ cookie: 'mock-auth-state=user; mock-auth-user=not-json' }));

        const user = await getCurrentUser();

        expect(user?.name).toBe('Test User');
    });

    it('falls back to defaults when mock-auth-user cookie is JSON null', async () => {
        headersMock.mockResolvedValue(new Headers({ cookie: `mock-auth-state=user; mock-auth-user=${encodeURIComponent('null')}` }));

        const user = await getCurrentUser();

        expect(user?.name).toBe('Test User');
    });

    it('returns null when there is no session', async () => {
        getSessionMock.mockResolvedValue(null);

        const user = await getCurrentUser();

        expect(user).toBeNull();
    });

    it('returns a user summary from a real session', async () => {
        getSessionMock.mockResolvedValue({
            user: { name: 'Bob', email: 'bob@example.com', playerId: 5, role: 'user' },
            session: null,
        });

        const user = await getCurrentUser();

        expect(user).toMatchObject({ name: 'Bob', email: 'bob@example.com', playerId: 5, role: 'user' });
    });

    it('sets role to admin when session role is admin', async () => {
        getSessionMock.mockResolvedValue({
            user: { name: 'Admin', email: 'admin@example.com', playerId: 2, role: 'admin' },
            session: null,
        });

        const user = await getCurrentUser();

        expect(user?.role).toBe('admin');
    });

    it('includes impersonatedBy from the session object', async () => {
        getSessionMock.mockResolvedValue({
            user: { name: 'Bob', email: 'bob@example.com', playerId: 5, role: 'user' },
            session: { impersonatedBy: 'admin-id' },
        });

        const user = await getCurrentUser();

        expect(user?.impersonatedBy).toBe('admin-id');
    });

    it('defaults null session fields to safe values', async () => {
        getSessionMock.mockResolvedValue({
            user: { name: null, email: null, playerId: null, role: null },
            session: null,
        });

        const user = await getCurrentUser();

        expect(user?.name).toBeNull();
        expect(user?.email).toBeNull();
        expect(user?.playerId).toBe(0);
        expect(user?.role).toBe('user');
    });

    it('skips mock auth entirely in production and falls back to real session', async () => {
        vi.stubEnv('NODE_ENV', 'production');
        headersMock.mockResolvedValue(new Headers({ cookie: 'mock-auth-state=admin' }));
        getSessionMock.mockResolvedValue(null);

        const user = await getCurrentUser();

        expect(user).toBeNull();
        expect(getSessionMock).toHaveBeenCalled();
    });
});
