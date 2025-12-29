'use server';

import { revalidatePath } from 'next/cache';

import clubSupporterService from '@/services/ClubSupporter';
import countrySupporterService from '@/services/CountrySupporter';
import playerService from '@/services/Player';
import playerEmailService from '@/services/PlayerEmail';
import { UpdatePlayerSchema } from '@/types/UpdatePlayerInput';

export async function updatePlayer(playerId: number, rawData: unknown) {
    const data = UpdatePlayerSchema.parse(rawData);

    // TODO: Allow for setting/unsetting the comment
    const { emails, clubs, countries } = data;
    const player = await playerService.update({
        id: playerId,
        anonymous: data.anonymous,
        name: data.name,
        born: data.born,
    });

    await playerEmailService.deleteExcept(playerId, emails);
    await playerEmailService.upsertAll(playerId, emails);

    await clubSupporterService.deleteExcept(playerId, clubs);
    await clubSupporterService.upsertAll(playerId, clubs);

    await countrySupporterService.deleteExcept(playerId, countries);
    await countrySupporterService.upsertAll(playerId, countries);

    revalidatePath(`/footy/player/${playerId}`);
    revalidatePath('/footy/players');

    return player;
}
