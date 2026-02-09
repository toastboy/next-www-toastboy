'use server';

import { revalidatePath } from 'next/cache';

import { sendEmailToAllActivePlayers } from '@/actions/sendEmailToAllActivePlayers';
import { cancelGameCore } from '@/lib/actions/cancelGame';
import { CancelGameInputSchema } from '@/types/actions/CancelGame';

/**
 * Cancels a game and revalidates related pages.
 *
 * @param rawData - The raw input data to be validated against
 * CancelGameInputSchema
 * @returns A promise that resolves to the cancelled gameDay object
 * @throws Will throw a validation error if rawData does not match
 * CancelGameInputSchema
 */
export async function cancelGame(rawData: unknown) {
    const data = CancelGameInputSchema.parse(rawData);
    const gameDay = await cancelGameCore(data, sendEmailToAllActivePlayers);

    revalidatePath('/footy/admin/picker');
    revalidatePath('/footy/admin/responses');
    revalidatePath('/footy/fixtures');

    return gameDay;
}
