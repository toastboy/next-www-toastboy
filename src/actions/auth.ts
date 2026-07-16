'use server';

import { revalidatePath } from 'next/cache';

import { requireAdmin } from '@/lib/auth.server';
import { listUsersActionCore, setAdminRoleActionCore } from '@/lib/core/auth';
import { broadcast } from '@/lib/events';
import { FootyChannel } from '@/types/FootyChannel';

/**
 * Lists auth users, optionally filtered by email.
 *
 * @param email - Optional email filter.
 * @param limit - Maximum number of users to fetch when `email` is absent.
 * Defaults to 10.
 * @throws {AuthError} When the user is not an admin.
 */
export async function listUsersAction(email?: string, limit?: number) {
    await requireAdmin();

    return await listUsersActionCore(email, limit);
}

/**
 * Grants or revokes admin role for a user.
 *
 * @param userId - The target user ID.
 * @param isAdmin - Whether to grant (`true`) or revoke (`false`) admin.
 * @throws {AuthError} When the user is not an admin.
 */
export async function setAdminRoleAction(userId: string, isAdmin: boolean) {
    await requireAdmin();

    await setAdminRoleActionCore(userId, isAdmin);

    revalidatePath('/footy/admin/users');
    revalidatePath('/footy/admin/user', 'layout');
    broadcast(FootyChannel.Users);
}
