'use server';

import { revalidatePath } from 'next/cache';
import playerRecordService from 'services/PlayerRecord';

export async function updatePlayerRecords() {
    await playerRecordService.deleteAll();
    await playerRecordService.upsertForGameDay();

    revalidatePath('/footy/admin');
}
