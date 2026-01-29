'use server';

import { triggerInvitationsCore } from '@/lib/actions/triggerInvitations';
import { NewGameInputSchema } from '@/types/actions/TriggerInvitations';

export async function triggerInvitations(rawData: unknown) {
    const data = NewGameInputSchema.parse(rawData);
    return await triggerInvitationsCore(data);
}
