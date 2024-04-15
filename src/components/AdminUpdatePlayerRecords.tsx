import { Button } from '@mantine/core';
import playerRecordService from 'services/PlayerRecord';
import { revalidatePath } from 'next/cache';

async function updatePlayerRecords() {
    'use server';

    await playerRecordService.upsertForGameDay();

    revalidatePath('/footy/admin');
}

export async function AdminUpdatePlayerRecords() {
    const playerRecords = await playerRecordService.getAll();

    return (
        <div>
            <p className="text-center">Player Record count: {playerRecords?.length}</p>
            <form action={updatePlayerRecords}>
                <Button type="submit">Update Player Records</Button>
            </form>
        </div >
    );
}
