'use server';

import { revalidatePath } from 'next/cache';

import { setDrinkersCore } from '@/lib/actions/setDrinkers';
import { InternalError, normalizeUnknownError } from '@/lib/errors';
import playerRecordService from '@/services/PlayerRecord';
import { SetDrinkersInputSchema } from '@/types/actions/SetDrinkers';

/**
 * Server action to set drinkers for a given game day and update related player records.
 *
 * @param rawData - Unvalidated input data for the set drinkers operation.
 * @returns The result of the core setDrinkers operation.
 * @throws Error if updating player records from the game day fails.
 */
export async function setDrinkers(rawData: unknown) {
    const data = SetDrinkersInputSchema.parse(rawData);
    const result = await setDrinkersCore(data);

    try {
        await playerRecordService.upsertFromGameDay(data.gameDayId);
    } catch (error) {
        const normalizedError = normalizeUnknownError(error);
        throw new InternalError(
            `Failed to update player records for game day ${data.gameDayId}.`,
            {
                cause: normalizedError,
                details: {
                    gameDayId: data.gameDayId,
                    operation: 'upsertFromGameDay',
                    upstreamCode: normalizedError.code,
                },
                publicMessage: 'Failed to update player records.',
            },
        );
    }
    revalidatePath('/footy/admin/drinkers');
    revalidatePath(`/footy/admin/drinkers/${data.gameDayId}`);
    revalidatePath('/footy/pub');
    revalidatePath('/footy/table/pub');
    revalidatePath(`/footy/game/${data.gameDayId}`);

    return result;
}
