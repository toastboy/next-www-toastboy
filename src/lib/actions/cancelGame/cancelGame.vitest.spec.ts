import { describe, expect, it, vi } from 'vitest';

import { cancelGameCore } from '@/lib/actions/cancelGame';
import { CancelGameInputSchema } from '@/types/actions/CancelGame';

describe('cancelGameCore', () => {
    const mockSendEmail = vi.fn();

    it('marks a game day as cancelled with a trimmed reason', async () => {
        const gameDay = {
            id: 1249,
            year: 2026,
            date: new Date('2026-02-03T00:00:00Z'),
            game: true,
            mailSent: new Date('2026-02-01T09:00:00Z'),
            comment: 'Initial note',
            bibs: null,
            pickerGamesHistory: 10 as const,
        };
        const gameDayService = {
            get: vi.fn().mockResolvedValue(gameDay),
            update: vi.fn().mockResolvedValue({
                ...gameDay,
                game: false,
                comment: 'Not enough players',
            }),
        };

        const data = CancelGameInputSchema.parse({
            gameDayId: 1249,
            reason: '  Not enough players  ',
        });

        const result = await cancelGameCore(data, mockSendEmail, { gameDayService });

        expect(gameDayService.update).toHaveBeenCalledWith({
            id: 1249,
            game: false,
            comment: 'Not enough players',
        });
        expect(result.game).toBe(false);
        expect(result.comment).toBe('Not enough players');
    });

    it('stores null when reason is whitespace only', async () => {
        const gameDay = {
            id: 1249,
            year: 2026,
            date: new Date('2026-02-03T00:00:00Z'),
            game: true,
            mailSent: new Date('2026-02-01T09:00:00Z'),
            comment: 'Initial note',
            bibs: null,
            pickerGamesHistory: null,
        };
        const gameDayService = {
            get: vi.fn().mockResolvedValue(gameDay),
            update: vi.fn().mockResolvedValue({
                ...gameDay,
                game: false,
                comment: null,
            }),
        };

        const data = CancelGameInputSchema.parse({
            gameDayId: 1249,
            reason: '   ',
        });

        await cancelGameCore(data, mockSendEmail, { gameDayService });

        expect(gameDayService.update).toHaveBeenCalledWith({
            id: 1249,
            game: false,
            comment: null,
        });
    });

    it('throws when the game day cannot be found', async () => {
        const gameDayService = {
            get: vi.fn().mockResolvedValue(null),
            update: vi.fn(),
        };

        await expect(cancelGameCore(
            {
                gameDayId: 9999,
                reason: 'weather',
            },
            mockSendEmail,
            { gameDayService },
        )).rejects.toThrow('Game day not found (id: 9999).');

        expect(gameDayService.update).not.toHaveBeenCalled();
    });
});
