'use server';

import { revalidatePath } from 'next/cache';

import { updatePlayerCore } from '@/lib/actions/updatePlayer';
import { broadcast } from '@/lib/events';
import { UpdatePlayerSchema } from '@/types/actions/UpdatePlayer';
import { FootyChannel } from '@/types/FootyChannel';

export async function updatePlayer(playerId: number, rawData: unknown) {
    const data = UpdatePlayerSchema.parse(rawData);
    const player = await updatePlayerCore(playerId, data);

    revalidatePath('/footy/players');
    revalidatePath('/footy/profile');
    revalidatePath(`/footy/player/${playerId}`);
    broadcast(FootyChannel.Players);

    return player;
}
