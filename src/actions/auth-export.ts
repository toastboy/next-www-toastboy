'use server';

import { requireAdmin } from '@/lib/auth.server';
import { authExportCore } from '@/lib/actions/authExport';

/**
 * Export Better Auth tables to Azure Blob Storage.
 *
 * @throws {AuthError} When the user is not an admin.
 */
export async function authExport(): Promise<void> {
    await requireAdmin();

    await authExportCore();
}
