'use server';

import { revalidatePath } from 'next/cache';

import { sendEmailVerification } from '@/actions/verifyEmail';
import clubSupporterService from '@/services/ClubSupporter';
import countrySupporterService from '@/services/CountrySupporter';
import playerService from '@/services/Player';
import playerExtraEmailService from '@/services/PlayerExtraEmail';
import { UpdatePlayerSchema } from '@/types/UpdatePlayerInput';

export async function updatePlayer(playerId: number, rawData: unknown) {
    const data = UpdatePlayerSchema.parse(rawData);

    const { addedExtraEmails, removedExtraEmails, clubs, countries } = data;
    const player = await playerService.update({
        id: playerId,
        anonymous: data.anonymous,
        name: data.name,
        born: data.born,
        comment: data.comment,
        finished: data.finished ?? null,
    });

    addedExtraEmails.forEach(async (addedEmail) => {
        try {
            await playerExtraEmailService.create({
                playerId,
                email: addedEmail,
            });
            await sendEmailVerification(addedEmail, player);
        } catch (error) {
            console.error('Error sending verification email to:', addedEmail, error);
        }
    });

    removedExtraEmails.forEach(async (removedEmail) => {
        try {
            await playerExtraEmailService.delete(removedEmail);
        } catch (error) {
            console.error('Error removing player extra email:', removedEmail, error);
        }
    });

    await clubSupporterService.deleteExcept(playerId, clubs);
    await clubSupporterService.upsertAll(playerId, clubs);

    await countrySupporterService.deleteExcept(playerId, countries);
    await countrySupporterService.upsertAll(playerId, countries);

    revalidatePath('/footy/players');
    revalidatePath('/footy/profile');
    revalidatePath(`/footy/player/${playerId}`);

    return player;
}
