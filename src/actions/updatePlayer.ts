'use server';

import { revalidatePath } from 'next/cache';

import playerService from '@/services/Player';
import playerEmailService from '@/services/PlayerEmail';
import { UpdatePlayerSchema } from '@/types/UpdatePlayerInput';

export async function updatePlayer(playerId: number, rawData: unknown) {
    const data = UpdatePlayerSchema.parse(rawData);

    // TODO: Allow for setting/unsetting anonymous, comment
    const { emails, clubs, countries } = data;
    const player = await playerService.update({
        id: playerId,
        name: data.name,
        born: data.born,
    });

    // Remove emails that are no longer present
    await playerEmailService.deleteExcept(playerId, emails);

    // Upsert provided emails
    await playerEmailService.upsertAll(playerId, emails);

    // await Promise.all(data.clubs.map((clubId) => (
    //     clubSupporterService.upsert({ playerId, clubId })
    // )));

    // await Promise.all(data.countries.map((countryISOCode) => (
    //     countrySupporterService.upsert({ playerId, countryISOCode })
    // )));

    revalidatePath(`/footy/player/${playerId}`);
    revalidatePath('/footy/players');

    return player;
}
