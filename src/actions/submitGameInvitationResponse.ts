'use server';

import gameDayService from '@/services/GameDay';
import gameInvitationService from '@/services/GameInvitation';
import outcomeService from '@/services/Outcome';
import { InvitationResponseInputSchema } from '@/types/InvitationResponseInput';

export async function submitGameInvitationResponse(rawData: unknown) {
    const data = InvitationResponseInputSchema.parse(rawData);

    const invitation = await gameInvitationService.get(data.token);
    if (!invitation) {
        throw new Error('Invitation not found.');
    }

    const gameDay = await gameDayService.get(invitation.gameDayId);
    const existingOutcome = await outcomeService.get(invitation.gameDayId, invitation.playerId);

    let responseInterval = existingOutcome?.responseInterval ?? null;
    // TODO: The logic for calculating responseInterval when mailSent is present
    // lacks explicit test coverage. The existing test in
    // submitGameInvitationResponse.test.ts only covers preservation of existing
    // intervals, not calculation of new ones.
    if (responseInterval === null && gameDay?.mailSent) {
        responseInterval = Math.max(0, Math.floor((Date.now() - gameDay.mailSent.getTime()) / 1000));
    }

    const comment = data.comment?.trim();

    await outcomeService.upsert({
        gameDayId: invitation.gameDayId,
        playerId: invitation.playerId,
        response: data.response,
        goalie: data.goalie,
        comment: comment && comment.length > 0 ? comment : null,
        responseInterval,
    });
}
