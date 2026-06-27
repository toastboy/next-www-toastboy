'use server';

import { revalidatePath } from 'next/cache';

import { updateInvoiceGameDaysCore } from '@/lib/actions/updateInvoiceGameDays';
import { requireAdmin } from '@/lib/auth.server';
import { broadcast } from '@/lib/events';
import { UpdateInvoiceGameDaysInputSchema } from '@/types/actions/UpdateInvoiceGameDays';
import { FootyChannel } from '@/types/FootyChannel';

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
    await updateInvoiceGameDaysCore(data);

    revalidatePath('/footy/admin/invoice');
    revalidatePath('/footy/fixtures');
    broadcast([FootyChannel.Money, FootyChannel.Games]);
}
