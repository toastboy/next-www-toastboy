'use server';

import { sendGameInvitations } from '@/lib/gameInvitations';
import { getInvitationDecision } from '@/lib/invitations';
import { NewGameInputSchema } from '@/types/NewGameInput';

export async function triggerInvitations(rawData: unknown) {
    const data = NewGameInputSchema.parse(rawData);
    const customMessage = data.customMessage?.trim();

    const decision = await getInvitationDecision({
        overrideTimeCheck: data.overrideTimeCheck,
        customMessage: customMessage && customMessage.length > 0 ? customMessage : null,
    });

    if (decision.status === 'ready' && decision.gameDayId) {
        await sendGameInvitations({
            gameDayId: decision.gameDayId,
            customMessage: decision.customMessage ?? null,
        });
    }

    return decision;
}
