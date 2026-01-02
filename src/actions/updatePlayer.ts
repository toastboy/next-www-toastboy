'use server';

import { revalidatePath } from 'next/cache';

import { addPlayerEmailInvite } from '@/actions/createPlayer';
import { sendEmail } from '@/actions/sendEmail';
import clubSupporterService from '@/services/ClubSupporter';
import countrySupporterService from '@/services/CountrySupporter';
import playerService from '@/services/Player';
import playerEmailService from '@/services/PlayerEmail';
import { UpdatePlayerSchema } from '@/types/UpdatePlayerInput';

export async function updatePlayer(playerId: number, rawData: unknown) {
    const data = UpdatePlayerSchema.parse(rawData);

    const { emails, addedEmails, removedEmails, clubs, countries } = data;
    const player = await playerService.update({
        id: playerId,
        anonymous: data.anonymous,
        name: data.name,
        born: data.born,
        comment: data.comment,
    });

    addedEmails.forEach(async (addedEmail) => {
        try {
            const verificationLink = await addPlayerEmailInvite(playerId, addedEmail);
            const html = [
                `<p>Hello${player.name ? ` ${player.name}` : ''},</p>`,
                '<p>Please verify your email address by clicking the link below:</p>',
                `<p><a href="${verificationLink}">Verify your email</a></p>`,
                '<p>If you did not request this, you can ignore this message.</p>',
            ].join('');

            await sendEmail(addedEmail, '', 'Toastboy FC email verification', html);
        } catch (error) {
            console.error('Error sending verification email to:', addedEmail, error);
        }
    });

    removedEmails.forEach((removedEmail) => {
        try {
            // TODO: work out a better way to handle removing user accounts
            console.log('&&&& remove player account:', removedEmail);
        } catch (error) {
            console.error('Error removing player account for email:', removedEmail, error);
        }
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
