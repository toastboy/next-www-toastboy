'use server';

import { revalidatePath } from 'next/cache';

import { SubmitResponseCore } from '@/lib/actions/submitResponse';
import { requireAdmin } from '@/lib/auth.server';
import { broadcast } from '@/lib/events';
import { SubmitResponseInputSchema } from '@/types/actions/SubmitResponse';
import { FootyChannel } from '@/types/FootyChannel';

/**
 * Submits a player response for a game day (admin override).
 *
 * @param rawData - The raw input to validate against SubmitResponseInputSchema.
 * @returns The result of the submission.
 * @throws {AuthError} When the user is not an admin.
 */
export async function SubmitResponse(rawData: unknown) {
    await requireAdmin();

    const data = SubmitResponseInputSchema.parse(rawData);
    const result = await SubmitResponseCore(data);

    revalidatePath('/footy/admin/picker');
    revalidatePath('/footy/admin/responses');
    revalidatePath('/footy/response');
    broadcast(FootyChannel.Responses);

    return result;
}
