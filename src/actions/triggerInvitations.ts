'use server';

import { getInvitationDecision } from '@/lib/invitations';
import { NewGameInputSchema } from '@/types/NewGameInput';

export async function triggerInvitations(rawData: unknown) {
    const data = NewGameInputSchema.parse(rawData);
    const customMessage = data.customMessage?.trim();

    return getInvitationDecision({
        overrideTimeCheck: data.overrideTimeCheck,
        customMessage: customMessage && customMessage.length > 0 ? customMessage : null,
    });
}
