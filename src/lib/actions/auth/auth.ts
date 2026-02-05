import 'server-only';

import type { UserWithRole } from 'better-auth/plugins/admin';
import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { getMockAuthState, getMockUsersList } from '@/lib/auth.server';

export type UserWithRolePayload = Omit<UserWithRole, 'createdAt' | 'updatedAt' | 'banExpires'> & {
    createdAt: string;
    updatedAt: string;
    banExpires: string | null;
};

interface AuthDeps {
    auth: typeof auth;
    headers: typeof headers;
    getMockAuthState: typeof getMockAuthState;
    getMockUsersList: typeof getMockUsersList;
}

const defaultDeps: AuthDeps = {
    auth,
    headers,
    getMockAuthState,
    getMockUsersList,
};

/**
 * Converts date-like properties of a `UserWithRole` into ISO string
 * representations.
 *
 * @param user - The user object containing `createdAt`, `updatedAt`, and
 * optional `banExpires` fields.
 * @returns A `UserWithRolePayload` with `createdAt`, `updatedAt`, and
 * `banExpires` serialized to ISO strings, leaving `banExpires` as `null` when
 * absent.
 */
const serializeUserDates = (user: UserWithRole): UserWithRolePayload => ({
    ...user,
    createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : new Date(user.createdAt).toISOString(),
    updatedAt: user.updatedAt instanceof Date ? user.updatedAt.toISOString() : new Date(user.updatedAt).toISOString(),
    banExpires: user.banExpires instanceof Date ?
        user.banExpires.toISOString() :
        user.banExpires ?
            new Date(user.banExpires).toISOString() :
            null,
});

/**
 * Retrieves a list of users, optionally filtered by email.
 *
 * In mock admin mode, returns all users or filters them by email if provided.
 * In mock non-admin mode, returns an empty array. In production mode, fetches
 * users from the auth API with optional email search.
 *
 * @param email - Optional email address to filter users by (supports partial
 * matches)
 * @param deps - Authentication dependencies including auth API and mock state
 * handlers
 * @returns Promise resolving to an array of users with serialized dates
 */
export async function listUsersActionCore(
    email?: string,
    deps: AuthDeps = defaultDeps,
): Promise<UserWithRolePayload[]> {
    const mockState = await deps.getMockAuthState();
    if (mockState === 'admin') {
        const users = deps.getMockUsersList();
        if (!email) return users.map(serializeUserDates);
        const decodedEmail = decodeURIComponent(email);
        return users
            .filter((user) => user.email.toLowerCase().includes(decodedEmail.toLowerCase()))
            .map(serializeUserDates);
    }
    if (mockState !== 'none') {
        return [];
    }

    const response = await deps.auth.api.listUsers({
        headers: await deps.headers(),
        query: email ?
            {
                searchField: 'email',
                searchOperator: 'contains',
                searchValue: decodeURIComponent(email),
            } :
            {
                limit: 10,
            },
    });

    return (response?.users ?? []).map(serializeUserDates);
}

/**
 * Sets the admin role for a user in the authentication system.
 *
 * @param userId - The ID of the user whose role should be set
 * @param isAdmin - Whether to set the user as an admin (true) or regular user
 * (false)
 * @param deps - Dependencies object containing auth API and utility functions
 * (defaults to defaultDeps)
 *
 * @throws {Error} Throws 'Forbidden' error if mock auth state is not 'none' or
 * 'admin'
 *
 * @returns A promise that resolves when the role has been successfully set
 *
 * @remarks
 * This function checks the mock auth state before proceeding:
 * - If state is 'admin', the operation is skipped
 * - If state is 'none', the operation proceeds
 * - Any other state results in a Forbidden error
 */
export async function setAdminRoleActionCore(
    userId: string,
    isAdmin: boolean,
    deps: AuthDeps = defaultDeps,
) {
    const mockState = await deps.getMockAuthState();
    if (mockState === 'admin') {
        return;
    }
    if (mockState !== 'none') {
        throw new Error('Forbidden');
    }

    await deps.auth.api.setRole({
        headers: await deps.headers(),
        body: {
            userId: userId,
            role: isAdmin ? 'admin' : 'user',
        },
    });
}
