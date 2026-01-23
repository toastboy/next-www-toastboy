'use server';

import { listUsersActionCore, setAdminRoleActionCore, type UserWithRolePayload } from '@/lib/actions/auth';

export type { UserWithRolePayload };

export async function listUsersAction(email?: string): Promise<UserWithRolePayload[]> {
    return await listUsersActionCore(email);
}

export async function setAdminRoleAction(userId: string, isAdmin: boolean) {
    await setAdminRoleActionCore(userId, isAdmin);
}
