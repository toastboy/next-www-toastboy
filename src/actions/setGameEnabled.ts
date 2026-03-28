'use server';

import { revalidatePath } from 'next/cache';

import { requireAdmin } from '@/lib/auth.server';
import { setGameEnabledCore } from '@/lib/actions/setGameEnabled';
import { sendEmailToAllActivePlayersCore } from '@/lib/actions/sendEmailToAllActivePlayers';
import { SetGameEnabledInputSchema } from '@/types/actions/SetGameEnabled';

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
    const gameDay = await setGameEnabledCore(data, sendEmailToAllActivePlayersCore);

    revalidatePath('/footy/admin/responses');
    revalidatePath('/footy/fixtures');
    revalidatePath(`/footy/admin/picker`);
    revalidatePath(`/footy/game`);

    return gameDay;
}
