import 'server-only';

import { SubmitResponseCore } from '@/lib/actions/submitResponse';
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

    return await SubmitResponseCore(
        {
            gameDayId: invitation.gameDayId,
            playerId: invitation.playerId,
            response: data.response,
            goalie: data.goalie,
            comment: data.comment,
        },
        { gameDayService: deps.gameDayService, outcomeService: deps.outcomeService },
    );
}
