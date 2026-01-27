'use server';

import { revalidatePath } from 'next/cache';

import { updatePlayerCore } from '@/lib/actions/updatePlayer';
import { UpdatePlayerSchema } from '@/types/actions/UpdatePlayer';

export async function updatePlayer(playerId: number, rawData: unknown) {
    const data = UpdatePlayerSchema.parse(rawData);
    const player = await updatePlayerCore(playerId, data);

    revalidatePath('/footy/players');
    revalidatePath('/footy/profile');
    revalidatePath(`/footy/player/${playerId}`);

    return player;
}
