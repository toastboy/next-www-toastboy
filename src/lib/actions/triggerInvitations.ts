import { sendGameInvitations } from '@/lib/gameInvitations';
import { getInvitationDecision } from '@/lib/invitations';
import type { NewGameInput } from '@/types/NewGameInput';

interface TriggerInvitationsDeps {
    getInvitationDecision: typeof getInvitationDecision;
    sendGameInvitations: typeof sendGameInvitations;
}

const defaultDeps: TriggerInvitationsDeps = {
    getInvitationDecision,
    sendGameInvitations,
};

export async function triggerInvitationsCore(
    data: NewGameInput,
    deps: TriggerInvitationsDeps = defaultDeps,
) {
    const customMessage = data.customMessage?.trim();
    const decision = await deps.getInvitationDecision(data.overrideTimeCheck);

    if (decision.status === 'ready' && decision.gameDayId) {
        await deps.sendGameInvitations(decision.gameDayId, customMessage);
    }

    return decision;
}
