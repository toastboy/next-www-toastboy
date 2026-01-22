import gameDayService from '@/services/GameDay';
import gameInvitationService from '@/services/GameInvitation';
import outcomeService from '@/services/Outcome';
import type { InvitationResponseInput } from '@/types/InvitationResponseInput';

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
