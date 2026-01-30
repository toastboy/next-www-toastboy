'use server';

import { listUsersActionCore, setAdminRoleActionCore } from '@/lib/actions/auth';

export async function listUsersAction(email?: string) {
    return await listUsersActionCore(email);
}

export async function setAdminRoleAction(userId: string, isAdmin: boolean) {
    await setAdminRoleActionCore(userId, isAdmin);
}
