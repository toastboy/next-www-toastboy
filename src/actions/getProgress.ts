'use server';

import playerRecordService from '@/services/PlayerRecord';

export async function getProgress(): Promise<[number, number] | null> {
    return playerRecordService.getProgress();
}
