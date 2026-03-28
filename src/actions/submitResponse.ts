'use server';

import { requireAdmin } from '@/lib/auth.server';
import { SubmitResponseCore } from '@/lib/actions/submitResponse';
import { SubmitResponseInputSchema } from '@/types/actions/SubmitResponse';

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
    return await SubmitResponseCore(data);
}
