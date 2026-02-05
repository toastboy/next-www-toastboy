import 'server-only';

import gameDayService from '@/services/GameDay';
import outcomeService from '@/services/Outcome';
import type { AdminResponseInput } from '@/types/actions/SubmitAdminResponse';

interface SubmitAdminResponseDeps {
    gameDayService: Pick<typeof gameDayService, 'get'>;
    outcomeService: Pick<typeof outcomeService, 'get' | 'upsert'>;
}

const defaultDeps: SubmitAdminResponseDeps = {
    gameDayService,
    outcomeService,
};

/**
 * Submits an admin response for a player's game day outcome.
 *
 * Calculates the response interval based on the time elapsed since the game day
 * mail was sent, trims and validates the comment, and upserts the outcome
 * record with the provided data.
 *
 * @param data - The admin response input containing gameDayId, playerId,
 * response, goalie, and optional comment
 * @param deps - Optional dependency injection object for services
 * (gameDayService and outcomeService)
 * @returns A promise resolving to the upserted outcome record
 * @throws Will throw if gameDay or outcome service operations fail
 *
 * @example
 * const result = await SubmitAdminResponseCore({
 *   gameDayId: 'game123',
 *   playerId: 'player456',
 *   response: 'confirmed',
 *   goalie: false,
 *   comment: 'Player confirmed attendance'
 * });
 */
export async function SubmitAdminResponseCore(
    data: AdminResponseInput,
    deps: SubmitAdminResponseDeps = defaultDeps,
) {
    // TODO: This is too similar to the player response logic. We should
    // probably unify them and just have a single "submit response" action that
    // handles both player and admin responses, with some conditional logic for
    // the differences.
    const gameDay = await deps.gameDayService.get(data.gameDayId);
    const existingOutcome = await deps.outcomeService.get(data.gameDayId, data.playerId);

    let responseInterval = existingOutcome?.responseInterval ?? null;
    if (responseInterval === null && gameDay?.mailSent) {
        responseInterval = Math.max(0, Math.floor((Date.now() - gameDay.mailSent.getTime()) / 1000));
    }

    const comment = data.comment?.trim();

    return await deps.outcomeService.upsert({
        gameDayId: data.gameDayId,
        playerId: data.playerId,
        response: data.response,
        goalie: data.goalie,
        comment: comment && comment.length > 0 ? comment : null,
        responseInterval,
    });
}
