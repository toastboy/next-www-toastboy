'use server';

import { revalidatePath } from 'next/cache';

import { sendEmailToAllActivePlayers } from '@/actions/sendEmailToAllActivePlayers';
import { setGameEnabledCore } from '@/lib/actions/setGameEnabled';
import { SetGameEnabledInputSchema } from '@/types/actions/SetGameEnabled';

/**
 * Cancels a game and revalidates related pages.
 *
 * @param rawData - The raw input data to be validated against
 * SetGameEnabledInputSchema
 * @returns A promise that resolves to the cancelled gameDay object
 * @throws Will throw a validation error if rawData does not match
 * SetGameEnabledInputSchema
 */
export async function setGameEnabled(rawData: unknown) {
    const data = SetGameEnabledInputSchema.parse(rawData);
    const gameDay = await setGameEnabledCore(data, sendEmailToAllActivePlayers);

    revalidatePath('/footy/admin/responses');
    revalidatePath('/footy/fixtures');
    revalidatePath(`/footy/admin/picker`);
    revalidatePath(`/footy/game`);

    return gameDay;
}
