'use server';

import playerRecordService from 'services/PlayerRecord';
import { revalidatePath } from 'next/cache';

export async function updatePlayerRecords() {
    await playerRecordService.upsertForGameDay();

    revalidatePath('/footy/admin');
}
