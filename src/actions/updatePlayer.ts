'use server';

import { revalidatePath } from 'next/cache';

import { coreUpdatePlayer } from '@/lib/core/updatePlayer';
import { broadcast } from '@/lib/events';
import { UpdatePlayerSchema } from '@/types/actions/UpdatePlayer';
import { FootyChannel } from '@/types/FootyChannel';

export async function updatePlayer(playerId: number, rawData: unknown) {
    const data = UpdatePlayerSchema.parse(rawData);
    const player = await coreUpdatePlayer(playerId, data);

    revalidatePath('/footy/players');
    revalidatePath('/footy/profile');
    revalidatePath(`/footy/player/${playerId}`);
    broadcast(FootyChannel.Players);

    return player;
}
