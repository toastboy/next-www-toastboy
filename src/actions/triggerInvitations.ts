'use server';

import { sendGameInvitations } from '@/lib/gameInvitations';
import { getInvitationDecision } from '@/lib/invitations';
import { NewGameInputSchema } from '@/types/NewGameInput';

export async function triggerInvitations(rawData: unknown) {
    const data = NewGameInputSchema.parse(rawData);
    const customMessage = data.customMessage?.trim();

    const decision = await getInvitationDecision(data.overrideTimeCheck);

    if (decision.status === 'ready' && decision.gameDayId) {
        await sendGameInvitations(decision.gameDayId, customMessage);
    }

    return decision;
}
