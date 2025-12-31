'use server';

import { UserWithRole } from 'better-auth/plugins/admin';
import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { getMockAuthState, getMockUsersList } from '@/lib/authServer';

export type UserWithRolePayload = Omit<UserWithRole, 'createdAt' | 'updatedAt' | 'banExpires'> & {
    createdAt: string;
    updatedAt: string;
    banExpires: string | null;
};

function serializeUserDates(user: UserWithRole): UserWithRolePayload {
    return {
        ...user,
        createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : new Date(user.createdAt).toISOString(),
        updatedAt: user.updatedAt instanceof Date ? user.updatedAt.toISOString() : new Date(user.updatedAt).toISOString(),
        banExpires: user.banExpires instanceof Date ? user.banExpires.toISOString() : user.banExpires ? new Date(user.banExpires).toISOString() : null,
    };
}

export async function listUsersAction(email?: string): Promise<UserWithRolePayload[]> {
    const mockState = await getMockAuthState();
    if (mockState === 'admin') {
        const users = getMockUsersList();
        if (!email) return users.map(serializeUserDates);
        const decodedEmail = decodeURIComponent(email);
        return users
            .filter((user) => user.email.toLowerCase().includes(decodedEmail.toLowerCase()))
            .map(serializeUserDates);
    }
    if (mockState !== 'none') {
        return [];
    }

    const response = await auth.api.listUsers({
        headers: await headers(),
        query: email ? {
            searchField: 'email',
            searchOperator: 'contains',
            searchValue: decodeURIComponent(email),
        } : {
            limit: 10,
        },
    });

    return (response?.users ?? []).map(serializeUserDates);
}

export async function setAdminRoleAction(userId: string, isAdmin: boolean) {
    const mockState = await getMockAuthState();
    if (mockState === 'admin') {
        return;
    }
    if (mockState !== 'none') {
        throw new Error('Forbidden');
    }

    await auth.api.setRole({
        headers: await headers(),
        body: {
            userId: userId,
            role: isAdmin ? 'admin' : 'user',
        },
    });
}
