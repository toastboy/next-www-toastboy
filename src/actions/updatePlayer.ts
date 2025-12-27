'use server';

import { revalidatePath } from 'next/cache';

import clubSupporterService from '@/services/ClubSupporter';
import countrySupporterService from '@/services/CountrySupporter';
import playerService from '@/services/Player';
import { UpdatePlayerSchema } from '@/types/UpdatePlayerInput';

export async function updatePlayer(playerId: number, rawData: unknown) {
    const data = UpdatePlayerSchema.parse(rawData);
    const name = data.name.trim();
    const born = typeof data.born === 'number' ? new Date(data.born, 0, 1) : null;

    const player = await playerService.upsert({
        id: playerId,
        name,
        born,
    });

    const emails = Array.from(new Set(
        data.emails
            .map((email) => email.trim().toLowerCase())
            .filter((email) => email.length > 0),
    ));

    for (const email of emails) {
        const existing = await playerService.getPlayerEmailByEmail(email);
        if (!existing) {
            await playerService.createPlayerEmail({ playerId, email });
        } else if (existing.playerId !== playerId) {
            throw new Error(`Email already in use: ${email}`);
        }
    }

    await Promise.all(data.clubs.map((clubId) => (
        clubSupporterService.upsert({ playerId, clubId })
    )));

    await Promise.all(data.countries.map((countryISOCode) => (
        countrySupporterService.upsert({ playerId, countryISOCode })
    )));

    revalidatePath(`/footy/player/${playerId}`);
    revalidatePath('/footy/players');

    return player;
}
