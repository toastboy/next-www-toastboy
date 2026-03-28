'use server';

import { revalidatePath } from 'next/cache';

import { recordHallHireCore } from '@/lib/actions/recordHallHire';
import { requireAdmin } from '@/lib/auth.server';
import { RecordHallHireInputSchema } from '@/types/actions/RecordHallHire';

/**
 * Records a hall hire (invoice) payment and revalidates related pages.
 *
 * @param rawData - The raw invoice data to be validated against
 * RecordHallHireInputSchema
 * @throws {AuthError} When the user is not an admin.
 */
export async function recordHallHire(rawData: unknown) {
    await requireAdmin();

    const data = RecordHallHireInputSchema.parse(rawData);
    await recordHallHireCore(data);

    revalidatePath('/footy/admin/money');
    revalidatePath('/footy/admin/invoice');
}
