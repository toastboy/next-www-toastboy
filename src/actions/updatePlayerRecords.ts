'use server';

import { revalidatePath } from 'next/cache';

import { updatePlayerRecordsCore } from '@/lib/actions/updatePlayerRecords';
import { requireAdmin } from '@/lib/auth.server';

/**
 * Recomputes aggregated player records and revalidates admin pages.
 *
 * @throws {AuthError} When the user is not an admin.
 */
export async function updatePlayerRecords() {
    await requireAdmin();

    await updatePlayerRecordsCore();

    revalidatePath('/footy/admin');
}
