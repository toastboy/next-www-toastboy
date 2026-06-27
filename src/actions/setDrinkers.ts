'use server';

import { revalidatePath } from 'next/cache';

import { requireAdmin } from '@/lib/auth.server';
import { setDrinkersCore } from '@/lib/core/setDrinkers';
import { broadcast } from '@/lib/events';
import { SetDrinkersInputSchema } from '@/types/actions/SetDrinkers';
import { FootyChannel } from '@/types/FootyChannel';

/**
 * Server action to set drinkers for a given game day and update related player records.
 *
 * @param rawData - Unvalidated input data for the set drinkers operation.
 * @returns The result of the core setDrinkers operation.
 * @throws {AuthError} When the user is not an admin.
 * @throws {InternalError} When updating player records fails.
 */
export async function setDrinkers(rawData: unknown) {
    await requireAdmin();

    const data = SetDrinkersInputSchema.parse(rawData);
    const result = await setDrinkersCore(data);

    revalidatePath('/footy/admin/drinkers');
    revalidatePath(`/footy/admin/drinkers/${data.gameDayId}`);
    revalidatePath('/footy/pub');
    revalidatePath('/footy/table/pub');
    revalidatePath(`/footy/game/${data.gameDayId}`);
    broadcast(FootyChannel.Games);

    return result;
}
