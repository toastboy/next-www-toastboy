'use server';

import { revalidatePath } from 'next/cache';

import { addPlayerInviteCore, createPlayerCore } from '@/lib/actions/createPlayer';
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
    const result = await createPlayerCore(data);

    revalidatePath('/footy/admin/newplayer');
    revalidatePath('/footy/players');

    return result;
}

/**
 * Creates an invitation verification for the given email and player, then
 * revalidates the relevant footy paths.
 *
 * @param playerId - The unique identifier of the player to invite.
 * @param email - The email address to send the invite to; optional if the
 * player profile has no login email.
 * @returns A URL string that the player can use to claim their account via the
 * tokenized verification link.
 */
export async function addPlayerInvite(
    playerId: number,
    email?: string,
) {
    const inviteLink = await addPlayerInviteCore(playerId, email);

    revalidatePath('/footy/admin/newplayer');
    revalidatePath('/footy/players');

    return inviteLink;
}
