'use server';

import { revalidatePath } from 'next/cache';

import { sendEmailVerification } from '@/actions/verifyEmail';
import clubSupporterService from '@/services/ClubSupporter';
import countrySupporterService from '@/services/CountrySupporter';
import playerService from '@/services/Player';
import playerEmailService from '@/services/PlayerEmail';
import { UpdatePlayerSchema } from '@/types/UpdatePlayerInput';

export async function updatePlayer(playerId: number, rawData: unknown) {
    const data = UpdatePlayerSchema.parse(rawData);

    const { addedEmails, removedEmails, clubs, countries } = data;
    const player = await playerService.update({
        id: playerId,
        anonymous: data.anonymous,
        name: data.name,
        born: data.born,
        comment: data.comment,
    });

    addedEmails.forEach(async (addedEmail) => {
        try {
            await playerEmailService.create({
                playerId,
                email: addedEmail,
            });
            await sendEmailVerification(addedEmail, player);
        } catch (error) {
            console.error('Error sending verification email to:', addedEmail, error);
        }
    });

    removedEmails.forEach(async (removedEmail) => {
        try {
            await playerEmailService.delete(removedEmail);
        } catch (error) {
            console.error('Error removing player email:', removedEmail, error);
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
