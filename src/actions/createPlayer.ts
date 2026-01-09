'use server';

import { revalidatePath } from 'next/cache';

import { getPublicBaseUrl } from '@/lib/urls';
import { createVerificationToken } from '@/lib/verificationToken';
import emailVerificationService from '@/services/EmailVerification';
import playerService from '@/services/Player';
import playerEmailService from '@/services/PlayerEmail';
import { CreatePlayerSchema } from '@/types/CreatePlayerInput';

/**
 * Creates a new player in the system with the provided data.
 *
 * @param rawData - The raw player data to be validated and processed. Must conform to CreatePlayerSchema.
 * @returns A promise that resolves to the created player object.
 * @throws {Error} When the introducedBy value is provided but not a valid number.
 * @throws {ZodError} When the rawData does not match the CreatePlayerSchema validation.
 *
 * @remarks
 * This function performs the following operations:
 * - Validates the input data against CreatePlayerSchema
 * - Trims whitespace from name and introducedBy fields
 * - Converts introducedBy to a number or null
 * - Creates a new player with the current date as joined date
 * - Revalidates the newplayer and players pages
 */
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
        introducedBy: introducedById,
        joined: new Date(),
    });

    return {
        player,
        inviteLink: await addPlayerEmailInvite(player.id, data.email),
    };
}

/**
 * Adds the given email to the player identified by playerId and prepares an
 * invitation link, then revalidates the relevant footy paths.
 *
 * @param playerId - The unique identifier of the player to invite.
 * @param email - The email address to send the invite to; optional if the
 * player profile has no email.
 * @returns A URL string that the player can use to claim their account via the
 * tokenized verification link.
 */
export async function addPlayerEmailInvite(
    playerId: number,
    email?: string,
) {
    const { token, tokenHash, expiresAt } = createVerificationToken();

    // It's possible to have a player profile with no email: responses will have
    // to be entered manually for them.
    if (email && email.length > 0) {
        await playerEmailService.create({ playerId, email });

        await emailVerificationService.create({
            playerId,
            email,
            tokenHash,
            expiresAt,
            purpose: 'player_invite',
        });
    }

    revalidatePath('/footy/newplayer');
    revalidatePath('/footy/players');

    return new URL(`/api/footy/auth/claim?token=${token}`, getPublicBaseUrl()).toString();
}
