import { describe, expect, it } from 'vitest';

import { getGameWinnersFromTeams, getTeamResultState } from '@/lib/gameResult';
import { createMockOutcome } from '@/tests/mocks/data/outcome';
import { defaultTeamPlayerList } from '@/tests/mocks/data/teamPlayer';

const withPoints = (points: 0 | 1 | 3) => (
    defaultTeamPlayerList.map((player) => ({
        ...player,
        outcome: createMockOutcome({
            ...player.outcome,
            team: player.outcome.team ?? 'A',
            points,
        }),
    }))
);

describe('gameResult helpers', () => {
    it('infers team A as winner from points', () => {
        expect(getGameWinnersFromTeams(withPoints(3), withPoints(0))).toBe('A');
    });

    it('infers team B as winner from points', () => {
        expect(getGameWinnersFromTeams(withPoints(0), withPoints(3))).toBe('B');
    });

    it('infers draw from points', () => {
        expect(getGameWinnersFromTeams(withPoints(1), withPoints(1))).toBe('draw');
    });

    it('returns null when points are not set consistently', () => {
        const teamA = withPoints(3);
        const teamB = withPoints(0);
        teamA[0] = {
            ...teamA[0],
            outcome: createMockOutcome({
                ...teamA[0].outcome,
                points: null,
            }),
        };

        expect(getGameWinnersFromTeams(teamA, teamB)).toBeNull();
    });

    it('returns per-team result state', () => {
        expect(getTeamResultState('A', 'A')).toBe('win');
        expect(getTeamResultState('B', 'A')).toBe('loss');
        expect(getTeamResultState('A', 'draw')).toBe('draw');
        expect(getTeamResultState('A', null)).toBe('unset');
    });
});
