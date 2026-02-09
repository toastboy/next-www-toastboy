import type { TeamName } from 'prisma/zod/schemas';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SubmitPickerCore } from '@/lib/actions/submitPicker';
import type { OutcomePlayerType } from '@/types/OutcomePlayerType';

describe('SubmitPickerCore', () => {
    const gameDay = {
        id: 1249,
        year: 2026,
        date: new Date('2026-02-03T00:00:00Z'),
        game: true,
        mailSent: new Date('2026-02-01T09:00:00Z'),
        comment: null,
        bibs: null,
        pickerGamesHistory: 10,
    };

    const createOutcomePlayer = ({
        playerId,
        name,
        born,
        goalie,
        team = null,
        response = 'Yes',
    }: {
        playerId: number;
        name: string;
        born: number | null;
        goalie: boolean;
        team?: TeamName | null;
        response?: OutcomePlayerType['response'];
    }): OutcomePlayerType => ({
        id: playerId,
        gameDayId: gameDay.id,
        playerId,
        response,
        responseInterval: null,
        points: null,
        team,
        comment: null,
        pub: null,
        paid: null,
        goalie,
        player: {
            id: playerId,
            name,
            accountEmail: null,
            anonymous: false,
            joined: null,
            finished: null,
            born,
            comment: null,
            introducedBy: null,
        },
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('resets teams for the whole game and picks teams using picker_best_teams ordering', async () => {
        const adminRows: OutcomePlayerType[] = [
            createOutcomePlayer({ playerId: 1, name: 'Alex', born: 1996, goalie: true }),
            createOutcomePlayer({ playerId: 2, name: 'Britt', born: 1996, goalie: false }),
            createOutcomePlayer({ playerId: 3, name: 'Casey', born: 1995, goalie: true }),
            createOutcomePlayer({ playerId: 4, name: 'Dev', born: 1995, goalie: false }),
            createOutcomePlayer({ playerId: 6, name: 'Eden', born: 1990, goalie: false, team: 'B' }),
        ];
        const playedByPlayer = new Map([
            [1, 10],
            [2, 8],
            [3, 9],
            [4, 8],
            [6, 5],
        ]);
        const averageByPlayer = new Map([
            [1, 3],
            [2, 2],
            [3, 3],
            [4, 2],
            [6, 1],
        ]);

        const deps = {
            gameDayService: {
                getCurrent: vi.fn().mockResolvedValue(gameDay),
            },
            outcomeService: {
                getAdminByGameDay: vi.fn().mockResolvedValue(adminRows),
                getPlayerGamesPlayed: vi.fn().mockImplementation((playerId: number) => playedByPlayer.get(playerId) ?? 0),
                getRecentAverage: vi.fn().mockImplementation((_gameDayId: number, playerId: number) => averageByPlayer.get(playerId) ?? 0),
                upsert: vi.fn().mockResolvedValue(null),
            },
            sendEmailToAllActivePlayers: vi.fn().mockResolvedValue({ recipientCount: 10 }),
            getPublicBaseUrl: () => 'https://example.test',
        };

        await SubmitPickerCore([
            { playerId: 1 },
            { playerId: 2 },
            { playerId: 3 },
            { playerId: 4 },
        ], deps);

        expect(deps.outcomeService.getRecentAverage).toHaveBeenCalledWith(1249, 1, 10);
        expect(deps.outcomeService.getRecentAverage).toHaveBeenCalledWith(1249, 2, 10);
        expect(deps.outcomeService.getRecentAverage).toHaveBeenCalledWith(1249, 3, 10);
        expect(deps.outcomeService.getRecentAverage).toHaveBeenCalledWith(1249, 4, 10);

        const upsertPayloads = deps.outcomeService.upsert.mock.calls.map(
            (call) => call[0] as { gameDayId: number; playerId: number; team: TeamName | null },
        );
        expect(upsertPayloads).toContainEqual({
            gameDayId: 1249,
            playerId: 1,
            team: null,
        });
        expect(upsertPayloads).toContainEqual({
            gameDayId: 1249,
            playerId: 2,
            team: null,
        });
        expect(upsertPayloads).toContainEqual({
            gameDayId: 1249,
            playerId: 3,
            team: null,
        });
        expect(upsertPayloads).toContainEqual({
            gameDayId: 1249,
            playerId: 4,
            team: null,
        });
        expect(upsertPayloads).toContainEqual({
            gameDayId: 1249,
            playerId: 6,
            team: null,
        });
        expect(upsertPayloads).toContainEqual({
            gameDayId: 1249,
            playerId: 1,
            team: 'A',
        });
        expect(upsertPayloads).toContainEqual({
            gameDayId: 1249,
            playerId: 4,
            team: 'A',
        });
        expect(upsertPayloads).toContainEqual({
            gameDayId: 1249,
            playerId: 2,
            team: 'B',
        });
        expect(upsertPayloads).toContainEqual({
            gameDayId: 1249,
            playerId: 3,
            team: 'B',
        });
        expect(upsertPayloads).toContainEqual({
            gameDayId: 1249,
            playerId: 6,
            team: null,
        });

        expect(deps.sendEmailToAllActivePlayers).toHaveBeenCalledWith(expect.objectContaining({
            subject: 'Footy: teams picked',
        }));
    });

    it('removes the middle outfield player for odd counts then adds them to the lower-average team', async () => {
        const adminRows: OutcomePlayerType[] = [
            createOutcomePlayer({ playerId: 1, name: 'Alex', born: 1996, goalie: true }),
            createOutcomePlayer({ playerId: 2, name: 'Britt', born: 1996, goalie: false }),
            createOutcomePlayer({ playerId: 3, name: 'Casey', born: 1996, goalie: false }),
            createOutcomePlayer({ playerId: 4, name: 'Dev', born: 1996, goalie: false }),
            createOutcomePlayer({ playerId: 5, name: 'Eden', born: 1996, goalie: true }),
        ];
        const playedByPlayer = new Map([
            [1, 10],
            [2, 5],
            [3, 5],
            [4, 5],
            [5, 10],
        ]);
        const averageByPlayer = new Map([
            [1, 4],
            [2, 2], // middle outfield player by goalie/played/average/age ordering
            [3, 1],
            [4, 5],
            [5, 2],
        ]);

        const deps = {
            gameDayService: {
                getCurrent: vi.fn().mockResolvedValue(gameDay),
            },
            outcomeService: {
                getAdminByGameDay: vi.fn().mockResolvedValue(adminRows),
                getPlayerGamesPlayed: vi.fn().mockImplementation((playerId: number) => playedByPlayer.get(playerId) ?? 0),
                getRecentAverage: vi.fn().mockImplementation((_gameDayId: number, playerId: number) => averageByPlayer.get(playerId) ?? 0),
                upsert: vi.fn().mockResolvedValue(null),
            },
            sendEmailToAllActivePlayers: vi.fn().mockResolvedValue({ recipientCount: 10 }),
            getPublicBaseUrl: () => 'https://example.test',
        };

        await SubmitPickerCore([
            { playerId: 1 },
            { playerId: 2 },
            { playerId: 3 },
            { playerId: 4 },
            { playerId: 5 },
        ], deps);

        const upsertPayloads = deps.outcomeService.upsert.mock.calls.map(
            (call) => call[0] as { gameDayId: number; playerId: number; team: TeamName | null },
        );
        expect(upsertPayloads).toContainEqual({
            gameDayId: 1249,
            playerId: 2,
            team: 'A',
        });
    });

    it('throws when no current game is available', async () => {
        const deps = {
            gameDayService: {
                getCurrent: vi.fn().mockResolvedValue(null),
            },
            outcomeService: {
                getAdminByGameDay: vi.fn(),
                getPlayerGamesPlayed: vi.fn(),
                getRecentAverage: vi.fn(),
                upsert: vi.fn(),
            },
            sendEmailToAllActivePlayers: vi.fn(),
            getPublicBaseUrl: () => 'https://example.test',
        };

        await expect(SubmitPickerCore([
            { playerId: 7 },
            { playerId: 9 },
        ], deps)).rejects.toThrow('No current game day available for picking teams.');
    });
});
