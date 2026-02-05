import { describe, expect, it, vi } from 'vitest';

import { SubmitResponseCore } from '@/lib/actions/submitResponse';

describe('SubmitResponseCore', () => {
    it('upserts the response and preserves a trimmed comment', async () => {
        const gameDayService = {
            get: vi.fn().mockResolvedValue({
                id: 99,
                year: 2024,
                date: new Date('2024-04-02T18:00:00Z'),
                game: true,
                mailSent: new Date('2024-03-30T09:00:00Z'),
                comment: null,
                bibs: null,
                pickerGamesHistory: null,
            }),
        };
        const outcomeService = {
            get: vi.fn().mockResolvedValue(null),
            upsert: vi.fn().mockResolvedValue(null),
        };

        await SubmitResponseCore(
            {
                gameDayId: 99,
                playerId: 7,
                response: 'Yes',
                goalie: true,
                comment: '  Ready to play  ',
            },
            { gameDayService, outcomeService },
        );

        expect(outcomeService.upsert).toHaveBeenCalledWith(
            expect.objectContaining({
                gameDayId: 99,
                playerId: 7,
                response: 'Yes',
                goalie: true,
                comment: 'Ready to play',
            }),
        );
    });

    it('preserves the existing response interval', async () => {
        const gameDayService = {
            get: vi.fn().mockResolvedValue({
                id: 99,
                year: 2024,
                date: new Date('2024-04-02T18:00:00Z'),
                game: true,
                mailSent: new Date('2024-03-30T09:00:00Z'),
                comment: null,
                bibs: null,
                pickerGamesHistory: null,
            }),
        };
        const outcomeService = {
            get: vi.fn().mockResolvedValue({
                id: 1,
                response: 'No',
                responseInterval: 123,
                points: null,
                team: null,
                comment: null,
                pub: null,
                paid: null,
                goalie: false,
                gameDayId: 99,
                playerId: 7,
            }),
            upsert: vi.fn().mockResolvedValue(null),
        };

        await SubmitResponseCore(
            {
                gameDayId: 99,
                playerId: 7,
                response: 'No',
                goalie: false,
                comment: '',
            },
            { gameDayService, outcomeService },
        );

        expect(outcomeService.upsert).toHaveBeenCalledWith(
            expect.objectContaining({
                responseInterval: 123,
            }),
        );
    });
});
