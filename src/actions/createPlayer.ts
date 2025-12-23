'use server';

import { revalidatePath } from 'next/cache';

import playerService from '@/services/Player';
import { CreatePlayerSchema } from '@/types/CreatePlayerInput';

export async function createPlayer(rawData: unknown) {
    const data = CreatePlayerSchema.parse(rawData);
    const name = data.name.trim();
    const introducedBy = data.introducedBy.trim();
    const introducedById = introducedBy ? Number(introducedBy) : null;

    if (introducedBy && Number.isNaN(introducedById)) {
        throw new Error('Introducer must be a number.');
    }

    const player = await playerService.create({
        name,
        email: data.email,
        introducedBy: introducedById,
        joined: new Date(),
    });

    revalidatePath('/footy/newplayer');
    revalidatePath('/footy/players');

    return player;
}
