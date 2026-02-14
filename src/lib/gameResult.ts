import type { TeamName } from 'prisma/zod/schemas';

import type { TeamPlayerType } from '@/types';

export type GameWinner = TeamName | 'draw' | null;
export type TeamResultState = 'win' | 'loss' | 'draw' | 'unset';

// TODO: It feels like these should be unnecessary and the winner should be a
// single database query, for example.

/**
 * Determines the unanimous points outcome for a team.
 *
 * Returns the points value (0, 1, or 3) if all players in the team have the
 * same points outcome. Returns null if the team is empty, if any player has an
 * invalid points value, or if players have different points values.
 *
 * @param team - An array of team players with outcome information
 * @returns The unanimous points value (0, 1, or 3) if all players agree,
 * otherwise null
 *
 * @example
 * ```typescript
 * const team = [
 *   { outcome: { points: 3 } },
 *   { outcome: { points: 3 } }
 * ];
 * pickTeamPoints(team); // returns 3
 * ```
 *
 * @example
 * ```typescript
 * const team = [
 *   { outcome: { points: 3 } },
 *   { outcome: { points: 1 } }
 * ];
 * pickTeamPoints(team); // returns null (different points)
 * ```
 */
const pickTeamPoints = (team: TeamPlayerType[]): 0 | 1 | 3 | null => {
    if (team.length === 0) return null;
    const distinctPoints = new Set<0 | 1 | 3>();

    // TODO: Run this check across history since it shouldn't happen
    for (const player of team) {
        const points = player.outcome.points;
        if (points !== 0 && points !== 1 && points !== 3) {
            return null;
        }
        distinctPoints.add(points);
    }

    if (distinctPoints.size !== 1) return null;

    return Array.from(distinctPoints)[0] ?? null;
};

/**
 * Determines the winner of a game based on team points.
 * @param teamA - Array of players in team A
 * @param teamB - Array of players in team B
 * @returns The game winner ('A', 'B', or 'draw'), or null if the result is invalid or undetermined
 */
export const getGameWinnersFromTeams = (
    teamA: TeamPlayerType[],
    teamB: TeamPlayerType[],
): GameWinner => {
    const pointsA = pickTeamPoints(teamA);
    const pointsB = pickTeamPoints(teamB);

    if (pointsA === null || pointsB === null) return null;
    if (pointsA === 1 && pointsB === 1) return 'draw';
    if (pointsA === 3 && pointsB === 0) return 'A';
    if (pointsA === 0 && pointsB === 3) return 'B';

    return null;
};

/**
 * Determines the result state for a specific team based on the game winner.
 *
 * @param team - The name of the team to check the result for
 * @param winner - The winner of the game (can be a team name, 'draw', or null)
 * @returns The result state for the specified team:
 *   - 'unset' if the winner is null (game not yet decided)
 *   - 'draw' if the game ended in a draw
 *   - 'win' if the specified team won
 *   - 'loss' if the specified team lost
 */
export const getTeamResultState = (
    team: TeamName,
    winner: GameWinner,
): TeamResultState => {
    if (winner === null) return 'unset';
    if (winner === 'draw') return 'draw';
    if (winner === team) return 'win';
    return 'loss';
};
