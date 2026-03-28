'use server';

import { revalidatePath } from 'next/cache';

import { requireAdmin } from '@/lib/auth.server';
import { SubmitPickerCore } from '@/lib/actions/submitPicker';
import { SubmitPickerInputSchema } from '@/types/actions/SubmitPicker';

/**
 * Submits the team pick for a game day and revalidates the game page.
 *
 * @param rawData - The raw input to validate against SubmitPickerInputSchema.
 * @throws {AuthError} When the user is not an admin.
 */
export async function SubmitPicker(rawData: unknown) {
    await requireAdmin();

    const data = SubmitPickerInputSchema.parse(rawData);
    await SubmitPickerCore(data);

    revalidatePath('/footy/game');
}
