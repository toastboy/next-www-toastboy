import { beforeEach, describe, expect, it, vi } from 'vitest';

import { setGameEnabledCore } from '@/lib/actions/setGameEnabled';
import { NotFoundError } from '@/lib/errors';
import { SetGameEnabledInputSchema } from '@/types/actions/SetGameEnabled';

describe('setGameEnabledCore', () => {
    const mockSendEmailToAllActivePlayers = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        mockSendEmailToAllActivePlayers.mockResolvedValue({ recipientCount: 0 });
    });

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

        const data = SetGameEnabledInputSchema.parse({
            gameDayId: 1249,
            game: false,
            reason: '  Not enough players  ',
        });

        const result = await setGameEnabledCore(data, mockSendEmailToAllActivePlayers, { gameDayService });

        expect(gameDayService.update).toHaveBeenCalledWith({
            id: 1249,
            game: false,
            comment: 'Not enough players',
        });
        expect(mockSendEmailToAllActivePlayers).toHaveBeenCalledTimes(1);
        const [firstPayload] = mockSendEmailToAllActivePlayers.mock.calls[0] as [{
            cc: string;
            subject: string;
            html: string;
        }];
        expect(firstPayload.subject).toContain('Game Cancelled:');
        expect(firstPayload.html).toContain('Reason: Not enough players');
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

        const data = SetGameEnabledInputSchema.parse({
            gameDayId: 1249,
            game: false,
            reason: '   ',
        });

        await setGameEnabledCore(data, mockSendEmailToAllActivePlayers, { gameDayService });

        expect(gameDayService.update).toHaveBeenCalledWith({
            id: 1249,
            game: false,
            comment: null,
        });
        expect(mockSendEmailToAllActivePlayers).toHaveBeenCalledTimes(1);
        const [secondPayload] = mockSendEmailToAllActivePlayers.mock.calls[0] as [{
            cc: string;
            subject: string;
            html: string;
        }];
        expect(secondPayload.html).not.toContain('Reason:');
    });

    it('marks a game day as reinstated and sends a reinstated email', async () => {
        const gameDay = {
            id: 1250,
            year: 2026,
            date: new Date('2026-02-10T00:00:00Z'),
            game: false,
            mailSent: new Date('2026-02-08T09:00:00Z'),
            comment: 'Bad weather',
            bibs: null,
            pickerGamesHistory: 10 as const,
        };
        const gameDayService = {
            get: vi.fn().mockResolvedValue(gameDay),
            update: vi.fn().mockResolvedValue({
                ...gameDay,
                game: true,
                comment: null,
            }),
        };

        const data = SetGameEnabledInputSchema.parse({
            gameDayId: 1250,
            game: true,
            reason: '',
        });

        const result = await setGameEnabledCore(data, mockSendEmailToAllActivePlayers, { gameDayService });

        expect(gameDayService.update).toHaveBeenCalledWith({
            id: 1250,
            game: true,
            comment: null,
        });
        const [payload] = mockSendEmailToAllActivePlayers.mock.calls[0] as [{
            subject: string;
            html: string;
        }];
        expect(payload.subject).toContain('Game Reinstated:');
        expect(payload.html).toContain('has been reinstated');
        expect(result.game).toBe(true);
    });

    it('throws when the game day cannot be found', async () => {
        const gameDayService = {
            get: vi.fn().mockResolvedValue(null),
            update: vi.fn(),
        };

        await expect(setGameEnabledCore(
            {
                gameDayId: 9999,
                game: false,
                reason: 'weather indoors',
            },
            mockSendEmailToAllActivePlayers,
            { gameDayService },
        )).rejects.toBeInstanceOf(NotFoundError);

        expect(gameDayService.update).not.toHaveBeenCalled();
        expect(mockSendEmailToAllActivePlayers).not.toHaveBeenCalled();
    });
});
