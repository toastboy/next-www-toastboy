import { describe, expect, it } from 'vitest';

import {
    getGameWinnerFromStatus,
    getPlayerPoints,
    getTeamResultState,
    isDecided,
    isGame,
} from '@/lib/gameResult';

describe('gameResult helpers', () => {
    describe('getGameWinnerFromStatus', () => {
        it('returns A for AWin', () => {
            expect(getGameWinnerFromStatus('AWin')).toBe('A');
        });

        it('returns B for BWin', () => {
            expect(getGameWinnerFromStatus('BWin')).toBe('B');
        });

        it('returns draw for Draw', () => {
            expect(getGameWinnerFromStatus('Draw')).toBe('draw');
        });

        it('returns null for Scheduled', () => {
            expect(getGameWinnerFromStatus('Scheduled')).toBeNull();
        });

        it('returns null for NoGame', () => {
            expect(getGameWinnerFromStatus('NoGame')).toBeNull();
        });
    });

    describe('getPlayerPoints', () => {
        it('returns null when the player has no team', () => {
            expect(getPlayerPoints('AWin', null)).toBeNull();
        });

        it('awards 3 to the winning team and 0 to the other on AWin', () => {
            expect(getPlayerPoints('AWin', 'A')).toBe(3);
            expect(getPlayerPoints('AWin', 'B')).toBe(0);
        });

        it('awards 3 to the winning team and 0 to the other on BWin', () => {
            expect(getPlayerPoints('BWin', 'B')).toBe(3);
            expect(getPlayerPoints('BWin', 'A')).toBe(0);
        });

        it('awards 1 to both teams on a Draw', () => {
            expect(getPlayerPoints('Draw', 'A')).toBe(1);
            expect(getPlayerPoints('Draw', 'B')).toBe(1);
        });

        it('returns null when the game has not been decided', () => {
            expect(getPlayerPoints('Scheduled', 'A')).toBeNull();
            expect(getPlayerPoints('NoGame', 'A')).toBeNull();
        });
    });

    describe('isGame', () => {
        it('is true for anything other than NoGame', () => {
            expect(isGame('Scheduled')).toBe(true);
            expect(isGame('AWin')).toBe(true);
            expect(isGame('BWin')).toBe(true);
            expect(isGame('Draw')).toBe(true);
        });

        it('is false for NoGame', () => {
            expect(isGame('NoGame')).toBe(false);
        });
    });

    describe('isDecided', () => {
        it('is true for AWin, BWin, and Draw', () => {
            expect(isDecided('AWin')).toBe(true);
            expect(isDecided('BWin')).toBe(true);
            expect(isDecided('Draw')).toBe(true);
        });

        it('is false for Scheduled and NoGame', () => {
            expect(isDecided('Scheduled')).toBe(false);
            expect(isDecided('NoGame')).toBe(false);
        });
    });

    describe('getTeamResultState', () => {
        it('returns per-team result state', () => {
            expect(getTeamResultState('A', 'A')).toBe('win');
            expect(getTeamResultState('B', 'A')).toBe('loss');
            expect(getTeamResultState('A', 'draw')).toBe('draw');
            expect(getTeamResultState('A', null)).toBe('unset');
        });
    });
});
