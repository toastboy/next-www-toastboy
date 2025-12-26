'use server';

import { revalidatePath } from 'next/cache';

import { createPlayerInvitationToken } from '@/lib/playerInvitation';
import { getSecrets } from '@/lib/secrets';
import playerService from '@/services/Player';
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

    const secrets = getSecrets();
    const { token, tokenHash, expiresAt } = createPlayerInvitationToken();

    // It's possible to have a player profile with no email: responses will have
    // to be entered manually for them.
    if (data.email && data.email.length > 0) {
        await playerService.createPlayerEmail({
            playerId: player.id,
            email: data.email,
        });

        await playerService.createPlayerInvitation({
            playerId: player.id,
            email: data.email,
            tokenHash,
            expiresAt,
        });
    }

    revalidatePath('/footy/newplayer');
    revalidatePath('/footy/players');

    return {
        player,
        inviteLink: `${secrets.BETTER_AUTH_URL}/footy/auth/claim?token=${token}`,
    };
}
