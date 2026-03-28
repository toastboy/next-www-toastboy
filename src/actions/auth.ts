'use server';

import { listUsersActionCore, setAdminRoleActionCore } from '@/lib/actions/auth';
import { requireAdmin } from '@/lib/auth.server';

/**
 * Lists auth users, optionally filtered by email.
 *
 * @param email - Optional email filter.
 * @throws {AuthError} When the user is not an admin.
 */
export async function listUsersAction(email?: string) {
    await requireAdmin();

    return await listUsersActionCore(email);
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
}
