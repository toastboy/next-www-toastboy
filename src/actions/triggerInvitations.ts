'use server';

import { triggerInvitationsCore } from '@/lib/actions/triggerInvitations';
import { requireAdmin } from '@/lib/auth.server';
import { NewGameInputSchema } from '@/types/actions/TriggerInvitations';

/**
 * Triggers game invitations for the next scheduled game day.
 *
 * @param rawData - The raw input to validate against NewGameInputSchema.
 * @returns The invitation decision result.
 * @throws {AuthError} When the user is not an admin.
 */
export async function triggerInvitations(rawData: unknown) {
    await requireAdmin();

    const data = NewGameInputSchema.parse(rawData);
    return await triggerInvitationsCore(data);
}
