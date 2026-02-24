'use server';

import { revalidatePath } from 'next/cache';

import { setGameResultCore } from '@/lib/actions/setGameResult';
import { InternalError, normalizeUnknownError } from '@/lib/errors';
import playerRecordService from '@/services/PlayerRecord';
import { SetGameResultInputSchema } from '@/types/actions/SetGameResult';

/**
 * Sets the result of a game and revalidates the associated cache.
 *
 * @param rawData - The raw input data to be validated and parsed according to
 * `SetGameResultInputSchema`.
 * @returns A promise that resolves to the updated game day after the result has
 * been set.
 * @throws Will throw a validation error if `rawData` does not conform to
 * `SetGameResultInputSchema`.
 */
export async function setGameResult(rawData: unknown) {
    // TODO: Isn't this always going to be fed by a form, and thus always be a
    // FormData object? If so, we should probably be parsing it as such, and
    // validating the form data instead of the raw data.
    const data = SetGameResultInputSchema.parse(rawData);
    const gameDay = await setGameResultCore(data);

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
    revalidatePath(`/footy/game/${data.gameDayId}`);
    revalidatePath('/footy/table');
    revalidatePath('/footy/pub');
    revalidatePath('/footy/points');

    return gameDay;
}
