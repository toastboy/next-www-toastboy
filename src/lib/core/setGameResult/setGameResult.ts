import 'server-only';

import type { GameDayStatus, TeamName } from 'prisma/zod/schemas';
import type { GameDayType } from 'prisma/zod/schemas/models/GameDay.schema';

import {
    InternalError,
    normalizeUnknownError,
    NotFoundError,
} from '@/lib/errors';
import gameDayService from '@/services/GameDay';
import transactionService from '@/services/Money';
import outcomeService from '@/services/Outcome';
import playerRecordService from '@/services/PlayerRecord';
import type { SetGameResultInput } from '@/types/actions/SetGameResult';

interface SetGameResultDeps {
    gameDayService: Pick<typeof gameDayService, 'get' | 'update'>;
    outcomeService: Pick<typeof outcomeService, 'getByGameDay'>;
    transactionService: Pick<typeof transactionService, 'charge'>;
    playerRecordService: Pick<typeof playerRecordService, 'upsertFromGameDay'>;
}

const defaultDeps: SetGameResultDeps = {
    gameDayService,
    outcomeService,
    transactionService,
    playerRecordService,
};

/**
 * Maps a game winner to the corresponding GameDay status.
 *
 * @param winner - The winner of the game: 'A' for player A wins, 'B' for player
 * B wins, 'draw' for a tie, or any other value for no result
 * @returns The GameDayStatus representing that result.
 *
 * @example
 * ```typescript
 * winnerToStatus('A');    // Returns 'AWin'
 * winnerToStatus('B');    // Returns 'BWin'
 * winnerToStatus('draw'); // Returns 'Draw'
 * winnerToStatus(null);   // Returns 'Scheduled'
 * ```
 */
const winnerToStatus = (
    winner: SetGameResultInput['winner'],
): GameDayStatus => {
    switch (winner) {
        case 'A':
            return 'AWin';
        case 'B':
            return 'BWin';
        case 'draw':
            return 'Draw';
        default:
            return 'Scheduled';
    }
};

/**
 * Charges each player on a given team on a game day for that day's cost.
 *
 * @param gameDay - The game day whose players should be charged.
 * @param team - The team whose players should be charged.
 * @param deps - Services used to load outcomes and charge transactions.
 * @throws Propagates any errors from outcome or transaction services.
 */
const chargeTeamOutcomes = async (
    gameDay: GameDayType,
    team: TeamName,
    deps: SetGameResultDeps,
) => {
    const outcomes = await deps.outcomeService.getByGameDay(gameDay.id, team);

    await Promise.all(
        outcomes.map((outcome) => {
            return deps.transactionService.charge(
                outcome.playerId,
                gameDay.id,
                gameDay.cost,
            );
        }),
    );
};

/**
 * Sets the result of a game by updating the game day's bibs and status, then
 * charges players and recomputes player records.
 *
 * @param data - The game result input containing gameDayId, bibs, and winner
 * information
 * @param deps - Optional dependencies for services (defaults to defaultDeps)
 * @returns A promise that resolves to the updated GameDay object
 * @throws {NotFoundError} If the game day with the specified ID is not found.
 * @throws {InternalError} If recomputing player records fails after a successful update.
 *
 * @remarks
 * This function performs the following operations:
 * 1. Retrieves the game day by ID
 * 2. Updates the game day with bibs and the status derived from the winner
 * 3. Charges both teams' players (A and B) in parallel
 * 4. Recomputes player records for the game day
 */
export async function setGameResultCore(
    data: SetGameResultInput,
    deps: SetGameResultDeps = defaultDeps,
): Promise<GameDayType> {
    const gameDay = await deps.gameDayService.get(data.gameDayId);
    if (!gameDay) {
        throw new NotFoundError(`Game day not found (id: ${data.gameDayId}).`);
    }

    const updatedGameDay = await deps.gameDayService.update({
        id: data.gameDayId,
        bibs: data.bibs,
        status: winnerToStatus(data.winner),
    });

    await Promise.all([
        chargeTeamOutcomes(gameDay, 'A', deps),
        chargeTeamOutcomes(gameDay, 'B', deps),
    ]);

    try {
        await deps.playerRecordService.upsertFromGameDay(data.gameDayId);
    } catch (error) {
        const normalizedError = normalizeUnknownError(error);
        throw new InternalError(
            `Failed to update player records for game day ${data.gameDayId}.`,
            {
                cause: normalizedError,
                details: {
                    gameDayId: data.gameDayId,
                    operation: 'upsertFromGameDay',
                    upstreamCode: normalizedError.code,
                },
                publicMessage: 'Failed to update player records.',
            },
        );
    }

    return updatedGameDay;
}
