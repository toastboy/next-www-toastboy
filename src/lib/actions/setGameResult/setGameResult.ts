import 'server-only';

import type { TeamName } from 'prisma/zod/schemas';
import type { GameDayType } from 'prisma/zod/schemas/models/GameDay.schema';

import gameDayService from '@/services/GameDay';
import outcomeService from '@/services/Outcome';
import type { SetGameResultInput } from '@/types/actions/SetGameResult';

interface SetGameResultDeps {
    gameDayService: Pick<typeof gameDayService, 'get' | 'update'>;
    outcomeService: Pick<typeof outcomeService, 'getByGameDay' | 'upsert'>;
}

const defaultDeps: SetGameResultDeps = {
    gameDayService,
    outcomeService,
};

/**
 * Maps a game winner to the corresponding points awarded to players A and B.
 *
 * @param winner - The winner of the game: 'A' for player A wins, 'B' for player
 * B wins, 'draw' for a tie, or any other value for no result
 * @returns An object containing points for both players: - Winner receives 3
 * points, loser receives 0 points - Draw results in 1 point for each player -
 * No result (default case) returns null for both players
 *
 * @example
 * ```typescript
 * mapWinnerToPoints('A');    // Returns { A: 3, B: 0 }
 * mapWinnerToPoints('B');    // Returns { A: 0, B: 3 }
 * mapWinnerToPoints('draw'); // Returns { A: 1, B: 1 }
 * mapWinnerToPoints(null);   // Returns { A: null, B: null }
 * ```
 */
const mapWinnerToPoints = (
    winner: SetGameResultInput['winner'],
): { A: 0 | 1 | 3 | null; B: 0 | 1 | 3 | null; } => {
    switch (winner) {
        case 'A':
            return { A: 3, B: 0 };
        case 'B':
            return { A: 0, B: 3 };
        case 'draw':
            return { A: 1, B: 1 };
        default:
            return { A: null, B: null };
    }
};

/**
 * Updates the points for all players in a team for a specific game day.
 *
 * Retrieves all outcomes for the specified team on the given game day and
 * updates each player's points to the provided value.
 *
 * @param gameDayId - The unique identifier of the game day
 * @param team - The team name to update points for
 * @param points - The points to assign (0, 1, 3, or null to clear points)
 * @param deps - Dependencies object containing the outcomeService for data
 * operations
 * @returns A promise that resolves when all player points have been updated
 */
const updateTeamPoints = async (
    gameDayId: number,
    team: TeamName,
    points: 0 | 1 | 3 | null,
    deps: SetGameResultDeps,
) => {
    const outcomes = await deps.outcomeService.getByGameDay(gameDayId, team);

    await Promise.all(outcomes.map((outcome) => (
        deps.outcomeService.upsert({
            gameDayId,
            playerId: outcome.playerId,
            points,
        })
    )));
};

/**
 * Sets the result of a game by updating the game day with team information and
 * calculating points.
 *
 * @param data - The game result input containing gameDayId, bibs, and winner
 * information
 * @param deps - Optional dependencies for services (defaults to defaultDeps)
 * @returns A promise that resolves to the updated GameDay object
 * @throws {Error} If the game day with the specified ID is not found
 *
 * @remarks
 * This function performs the following operations:
 * 1. Retrieves the game day by ID
 * 2. Updates the game day with bibs information
 * 3. Calculates points based on the winner
 * 4. Updates points for both teams (A and B) in parallel
 */
export async function setGameResultCore(
    data: SetGameResultInput,
    deps: SetGameResultDeps = defaultDeps,
): Promise<GameDayType> {
    const gameDay = await deps.gameDayService.get(data.gameDayId);
    if (!gameDay) {
        throw new Error(`Game day not found (id: ${data.gameDayId}).`);
    }

    const updatedGameDay = await deps.gameDayService.update({
        id: data.gameDayId,
        bibs: data.bibs,
    });

    const pointsByTeam = mapWinnerToPoints(data.winner);

    await Promise.all([
        updateTeamPoints(data.gameDayId, 'A', pointsByTeam.A, deps),
        updateTeamPoints(data.gameDayId, 'B', pointsByTeam.B, deps),
    ]);

    return updatedGameDay;
}
