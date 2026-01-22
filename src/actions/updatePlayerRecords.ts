'use server';

import { revalidatePath } from 'next/cache';

import { updatePlayerRecordsCore } from '@/lib/actions/updatePlayerRecords';

export async function updatePlayerRecords() {
    await updatePlayerRecordsCore();

    revalidatePath('/footy/admin');
}
