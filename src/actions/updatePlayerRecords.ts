'use server';

import { revalidatePath } from 'next/cache';

import { requireAdmin } from '@/lib/auth.server';
import { updatePlayerRecordsCore } from '@/lib/core/updatePlayerRecords';
import { broadcast } from '@/lib/events';
import { FootyChannel } from '@/types/FootyChannel';

/**
 * Recomputes aggregated player records and revalidates admin pages.
 *
 * @throws {AuthError} When the user is not an admin.
 */
export async function updatePlayerRecords() {
    await requireAdmin();

    await updatePlayerRecordsCore();

    revalidatePath('/footy/admin');
    broadcast([FootyChannel.Players, FootyChannel.Results]);
}
