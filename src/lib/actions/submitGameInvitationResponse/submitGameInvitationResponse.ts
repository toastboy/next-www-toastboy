import 'server-only';

import gameDayService from '@/services/GameDay';
import gameInvitationService from '@/services/GameInvitation';
import outcomeService from '@/services/Outcome';
import type { InvitationResponseInput } from '@/types/actions/SubmitGameInvitationResponse';

interface SubmitGameInvitationResponseDeps {
    gameInvitationService: Pick<typeof gameInvitationService, 'get'>;
    gameDayService: Pick<typeof gameDayService, 'get'>;
    outcomeService: Pick<typeof outcomeService, 'get' | 'upsert'>;
}

const defaultDeps: SubmitGameInvitationResponseDeps = {
    gameInvitationService,
    gameDayService,
    outcomeService,
};

/**
 * Processes a game invitation response and updates the outcome record.
 *
 * @param data - The invitation response input containing token, response
 * status, goalie flag, and optional comment
 * @param deps - Service dependencies for accessing game invitations, game days,
 * and outcomes (uses defaults if not provided)
 * @returns A promise that resolves to the upserted outcome record
 * @throws {Error} If the invitation cannot be found
 *
 * @example
 * const outcome = await submitGameInvitationResponseCore(
 *   { token: 'abc123', response: 'yes', goalie: false, comment: 'See you there!' }
 * );
 */
export async function submitGameInvitationResponseCore(
    data: InvitationResponseInput,
    deps: SubmitGameInvitationResponseDeps = defaultDeps,
) {
    const invitation = await deps.gameInvitationService.get(data.token);
    if (!invitation) {
        throw new Error('Invitation not found.');
    }

    const gameDay = await deps.gameDayService.get(invitation.gameDayId);
    const existingOutcome = await deps.outcomeService.get(invitation.gameDayId, invitation.playerId);

    let responseInterval = existingOutcome?.responseInterval ?? null;
    if (responseInterval === null && gameDay?.mailSent) {
        responseInterval = Math.max(0, Math.floor((Date.now() - gameDay.mailSent.getTime()) / 1000));
    }

    const comment = data.comment?.trim();

    return await deps.outcomeService.upsert({
        gameDayId: invitation.gameDayId,
        playerId: invitation.playerId,
        response: data.response,
        goalie: data.goalie,
        comment: comment && comment.length > 0 ? comment : null,
        responseInterval,
    });
}
