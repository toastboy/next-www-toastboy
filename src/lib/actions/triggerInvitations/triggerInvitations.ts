import 'server-only';

import { sendGameInvitations } from '@/lib/gameInvitations';
import { getInvitationDecision } from '@/lib/invitations';
import type { NewGameInput } from '@/types/actions/TriggerInvitations';

interface TriggerInvitationsDeps {
    getInvitationDecision: typeof getInvitationDecision;
    sendGameInvitations: typeof sendGameInvitations;
}

const defaultDeps: TriggerInvitationsDeps = {
    getInvitationDecision,
    sendGameInvitations,
};

/**
 * Triggers the process of sending game invitations based on the provided input
 * and dependencies.
 *
 * @param data - The input data for the new game, including optional custom
 * message and override time check.
 * @param deps - The dependencies required for triggering invitations, such as
 * decision logic and sending functionality. Defaults to `defaultDeps`.
 * @returns A promise that resolves to the invitation decision, indicating the
 * status and associated game day ID if applicable.
 */
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
