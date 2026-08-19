import type { GameDayStatus, TeamName } from 'prisma/zod/schemas';

import type { PointsValue } from '@/types/Points';

export type GameWinner = TeamName | 'draw' | null;
export type TeamResultState = 'win' | 'loss' | 'draw' | 'unset';

/**
 * Derives the game winner directly from GameDay.status.
 * @param status - The game day's status.
 * @returns The game winner ('A', 'B', or 'draw'), or null if the game hasn't
 * been decided (Scheduled or NoGame).
 */
export const getGameWinnerFromStatus = (status: GameDayStatus): GameWinner => {
    switch (status) {
        case 'AWin':
            return 'A';
        case 'BWin':
            return 'B';
        case 'Draw':
            return 'draw';
        default:
            return null;
    }
};

/**
 * Derives a player's match points from the game's status and their team.
 * @param status - The game day's status.
 * @param team - The player's team for that game day, or null if unassigned.
 * @returns 0 (loss), 1 (draw), or 3 (win), or null if there is no team
 * assignment or the game hasn't been decided.
 */
export const getPlayerPoints = (
    status: GameDayStatus,
    team: TeamName | null,
): PointsValue | null => {
    if (team === null) return null;

    switch (status) {
        case 'AWin':
            return team === 'A' ? 3 : 0;
        case 'BWin':
            return team === 'B' ? 3 : 0;
        case 'Draw':
            return 1;
        default:
            return null;
    }
};

/**
 * Whether a game day represents an actual match, as opposed to a
 * not-yet-scheduled or cancelled slot.
 * @param status - The game day's status.
 * @returns True unless the status is NoGame.
 */
export const isGame = (status: GameDayStatus): boolean => status !== 'NoGame';

/**
 * Whether a game day's result has been decided.
 * @param status - The game day's status.
 * @returns True for AWin, BWin, or Draw.
 */
export const isDecided = (status: GameDayStatus): boolean =>
    status === 'AWin' || status === 'BWin' || status === 'Draw';

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
