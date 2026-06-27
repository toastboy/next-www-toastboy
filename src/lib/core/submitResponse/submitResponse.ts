import 'server-only';

import gameDayService from '@/services/GameDay';
import outcomeService from '@/services/Outcome';
import type { SubmitResponseInput } from '@/types/actions/SubmitResponse';

interface SubmitResponseDeps {
    gameDayService: Pick<typeof gameDayService, 'get'>;
    outcomeService: Pick<typeof outcomeService, 'get' | 'upsert'>;
}

const defaultDeps: SubmitResponseDeps = {
    gameDayService,
    outcomeService,
};

/**
 * Submits a response for a player's game day outcome.
 *
 * Calculates the response interval based on the time elapsed since the game day
 * mail was sent, trims and validates the comment, and upserts the outcome
 * record with the provided data.
 *
 * @param data - The response input containing gameDayId, playerId,
 * response, goalie, and optional comment
 * @param deps - Optional dependency injection object for services
 * (gameDayService and outcomeService)
 * @returns A promise resolving to the upserted outcome record
 * @throws Will throw if gameDay or outcome service operations fail
 *
 * @example
 * const result = await SubmitResponseCore({
 *   gameDayId: 1249,
 *   playerId: 42,
 *   response: 'Yes',
 *   goalie: false,
 *   comment: 'Player confirmed attendance',
 * });
 */
export async function SubmitResponseCore(
    data: SubmitResponseInput,
    deps: SubmitResponseDeps = defaultDeps,
) {
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
