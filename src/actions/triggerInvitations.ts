'use server';

import { revalidatePath } from 'next/cache';

import { requireAdmin } from '@/lib/auth.server';
import { triggerInvitationsCore } from '@/lib/core/triggerInvitations';
import { broadcast } from '@/lib/events';
import { NewGameInputSchema } from '@/types/actions/TriggerInvitations';
import { FootyChannel } from '@/types/FootyChannel';

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
    const decision = await triggerInvitationsCore(data);

    revalidatePath('/footy/admin/newgame');
    revalidatePath('/footy/admin/responses');
    revalidatePath('/footy/admin/picker');
    revalidatePath('/footy/response');
    broadcast(FootyChannel.Invitations);

    return decision;
}
