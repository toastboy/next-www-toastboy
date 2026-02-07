'use server';

import { revalidatePath } from 'next/cache';

import { cancelGameCore } from '@/lib/actions/cancelGame';
import { CancelGameInputSchema } from '@/types/actions/CancelGame';
import { SendEmailProxy } from '@/types/actions/SendEmail';

/**
 * Cancels a game and revalidates related pages.
 *
 * @param rawData - The raw input data to be validated against
 * CancelGameInputSchema
 * @returns A promise that resolves to the cancelled gameDay object
 * @throws Will throw a validation error if rawData does not match
 * CancelGameInputSchema
 */
export async function cancelGame(rawData: unknown, sendEmail: SendEmailProxy) {
    const data = CancelGameInputSchema.parse(rawData);
    const gameDay = await cancelGameCore(data, sendEmail);

    revalidatePath('/footy/admin/picker');
    revalidatePath('/footy/admin/responses');
    revalidatePath('/footy/fixtures');

    return gameDay;
}
