'use server';

import { authExportCore } from '@/lib/actions/authExport';

/**
 * Export Better Auth tables to Azure Blob Storage.
 */
export async function authExport(): Promise<void> {
    await authExportCore();
}
