'use server';

import { revalidatePath } from 'next/cache';

import { sendEmailToAllActivePlayers } from '@/actions/sendEmailToAllActivePlayers';
import { requireAdmin } from '@/lib/auth.server';
import { setGameEnabledCore } from '@/lib/core/setGameEnabled';
import { broadcast } from '@/lib/events';
import { SetGameEnabledInputSchema } from '@/types/actions/SetGameEnabled';
import { FootyChannel } from '@/types/FootyChannel';

/**
 * Cancels a game and revalidates related pages.
 *
 * @param rawData - The raw input data to be validated against
 * SetGameEnabledInputSchema
 * @returns A promise that resolves to the cancelled gameDay object
 * @throws {AuthError} When the user is not an admin.
 * @throws Will throw a validation error if rawData does not match
 * SetGameEnabledInputSchema
 */
export async function setGameEnabled(rawData: unknown) {
    await requireAdmin();

    const data = SetGameEnabledInputSchema.parse(rawData);
    const gameDay = await setGameEnabledCore(data, sendEmailToAllActivePlayers);

    revalidatePath('/footy/admin/responses');
    revalidatePath('/footy/fixtures');
    revalidatePath(`/footy/admin/picker`);
    revalidatePath(`/footy/game`);
    broadcast(FootyChannel.Games);

    return gameDay;
}
