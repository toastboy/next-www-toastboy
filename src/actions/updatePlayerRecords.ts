'use server';

import { revalidatePath } from 'next/cache';

import { requireAdmin } from '@/lib/auth.server';
import { updatePlayerRecordsCore } from '@/lib/actions/updatePlayerRecords';

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
