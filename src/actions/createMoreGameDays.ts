'use server';

import { revalidatePath } from 'next/cache';

import { requireAdmin } from '@/lib/auth.server';
import { createMoreGameDaysCore } from '@/lib/actions/createMoreGameDays';
import { CreateMoreGameDaysSchema } from '@/types/actions/CreateMoreGameDays';

/**
 * Creates additional game days from the provided schedule data.
 *
 * @param rawData - The raw input to validate against CreateMoreGameDaysSchema.
 * @returns The created game days.
 * @throws {AuthError} When the user is not an admin.
 */
export async function createMoreGameDays(rawData: unknown) {
    await requireAdmin();

    const data = CreateMoreGameDaysSchema.parse(rawData);
    const created = await createMoreGameDaysCore(data);

    revalidatePath('/footy/admin/moregames');
    revalidatePath('/footy/fixtures');

    return created;
}
