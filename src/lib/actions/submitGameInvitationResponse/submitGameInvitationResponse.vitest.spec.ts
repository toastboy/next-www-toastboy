import { describe, expect, it, vi } from 'vitest';

import { submitGameInvitationResponseCore } from '@/lib/actions/submitGameInvitationResponse';
import { NotFoundError } from '@/lib/errors';

describe('submitGameInvitationResponseCore', () => {
    it('upserts the response and preserves a trimmed comment', async () => {
        const gameInvitationService = {
            get: vi.fn().mockResolvedValue({
                uuid: '123e4567-e89b-12d3-a456-426614174000',
                playerId: 7,
                gameDayId: 99,
            }),
        };
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

        await submitGameInvitationResponseCore(
            {
                token: '123e4567-e89b-12d3-a456-426614174000',
                response: 'Yes',
                goalie: true,
                comment: '  Ready to play  ',
            },
            { gameInvitationService, gameDayService, outcomeService },
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
        const gameInvitationService = {
            get: vi.fn().mockResolvedValue({
                uuid: '123e4567-e89b-12d3-a456-426614174000',
                playerId: 7,
                gameDayId: 99,
            }),
        };
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

        await submitGameInvitationResponseCore(
            {
                token: '123e4567-e89b-12d3-a456-426614174000',
                response: 'No',
                goalie: false,
                comment: '',
            },
            { gameInvitationService, gameDayService, outcomeService },
        );

        expect(outcomeService.upsert).toHaveBeenCalledWith(
            expect.objectContaining({
                responseInterval: 123,
            }),
        );
    });

    it('throws NotFoundError when invitation does not exist', async () => {
        const gameInvitationService = {
            get: vi.fn().mockResolvedValue(null),
        };
        const gameDayService = {
            get: vi.fn(),
        };
        const outcomeService = {
            get: vi.fn(),
            upsert: vi.fn(),
        };

        await expect(
            submitGameInvitationResponseCore(
                {
                    token: 'missing-token',
                    response: 'No',
                    goalie: false,
                    comment: null,
                },
                { gameInvitationService, gameDayService, outcomeService },
            ),
        ).rejects.toBeInstanceOf(NotFoundError);

        expect(gameDayService.get).not.toHaveBeenCalled();
        expect(outcomeService.get).not.toHaveBeenCalled();
        expect(outcomeService.upsert).not.toHaveBeenCalled();
    });
});
