import { headers } from 'next/headers';
import { AuthRole, AuthUserSummary } from 'types/AuthUser';

import { auth } from '@/lib/auth';

export const MOCK_AUTH_COOKIE = 'mock-auth-state';

const mockUsers: Record<Exclude<AuthRole, 'none'>, AuthUserSummary> = {
    user: {
        name: 'Test User',
        email: 'testuser@example.com',
        playerId: 1,
        role: 'user',
    },
    admin: {
        name: 'Test Admin',
        email: 'testadmin@example.com',
        playerId: 2,
        role: 'admin',
    },
};

export async function getMockAuthState(): Promise<AuthRole> {
    const cookieHeader = (await headers()).get('cookie');
    if (!cookieHeader) {
        return 'none';
    }

    const cookiesList = cookieHeader.split(';').map((cookie) => cookie.trim());
    for (const cookie of cookiesList) {
        const [name, ...rest] = cookie.split('=');
        if (name === MOCK_AUTH_COOKIE) {
            const value = decodeURIComponent(rest.join('='));
            return value === 'admin' || value === 'user' ? value : 'none';
        }
    }

    return 'none';
}

export async function getMockUser(): Promise<AuthUserSummary | null> {
    const state = await getMockAuthState();
    if (state === 'user' || state === 'admin') {
        return mockUsers[state];
    }
    return null;
}

export function getMockUsersList() {
    return [
        {
            id: 'test-user-id',
            name: 'Test User',
            email: 'testuser@example.com',
            role: 'user',
            createdAt: new Date('2023-01-01'),
            updatedAt: new Date('2023-01-01'),
            emailVerified: false,
            image: null,
            banned: false,
            banReason: null,
            banExpires: null,
        },
        {
            id: 'test-admin-id',
            name: 'Test Admin',
            email: 'testadmin@example.com',
            role: 'admin',
            createdAt: new Date('2023-01-01'),
            updatedAt: new Date('2023-01-01'),
            emailVerified: false,
            image: null,
            banned: false,
            banReason: null,
            banExpires: null,
        },
    ];
}

export async function getSession() {
    const mockUser = await getMockUser();
    if (mockUser) {
        return { session: null, user: mockUser };
    }

    return auth.api.getSession({
        headers: await headers(),
    });
}

export async function getCurrentUser(): Promise<AuthUserSummary | null> {
    const mockUser = await getMockUser();
    if (mockUser) {
        return mockUser;
    }

    const session = await auth.api.getSession({
        headers: await headers(),
    }) as { user?: { name?: string | null; email?: string | null; playerId?: number | null; role?: string | null } | null } | null;

    if (!session?.user) {
        return null;
    }

    return {
        name: session.user.name ?? null,
        email: session.user.email ?? null,
        playerId: session.user.playerId ?? 0,
        role: session.user.role === 'admin' ? 'admin' : 'user',
    };
}

/**
 * Retrieves the role of the currently authenticated user.
 *
 * @returns A promise that resolves to one of the following roles:
 * - `'none'`: If there is no active session or the session data is null.
 * - `'user'`: If the user is authenticated but does not have an admin role.
 * - `'admin'`: If the user is authenticated and has an admin role.
 *
 * The function uses `auth.api` to fetch the current session and determines
 * the user's role based on the session data.
 */
export async function getUserRole(): Promise<AuthRole> {
    const mockState = await getMockAuthState();
    if (mockState !== 'none') {
        return mockState;
    }

    const session = await auth.api.getSession({
        headers: await headers(),
    }) as { user?: { role?: string | null } | null } | null;

    if (session?.user?.role === 'admin') {
        return 'admin';
    }
    if (session?.user) {
        return 'user';
    }
    return 'none';
}
