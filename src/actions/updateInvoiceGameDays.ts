'use server';

import { revalidatePath } from 'next/cache';

import { requireAdmin } from '@/lib/auth.server';
import gameDayService from '@/services/GameDay';
import { UpdateInvoiceGameDaysInputSchema } from '@/types/actions/UpdateInvoiceGameDays';

/**
 * Updates the game/no-game status of a set of game days without sending player
 * emails. Used when verifying next month's booked dates against an invoice from
 * Kelsey Kerridge.
 *
 * @param rawData - The raw input to be validated against
 * UpdateInvoiceGameDaysInputSchema
 * @throws {AuthError} When the user is not an admin.
 */
export async function updateInvoiceGameDays(rawData: unknown) {
    await requireAdmin();

    const data = UpdateInvoiceGameDaysInputSchema.parse(rawData);

    await Promise.all(
        data.gameDays.map((gd) => gameDayService.update({ id: gd.id, game: gd.gameScheduled })),
    );

    revalidatePath('/footy/admin/invoice');
}
