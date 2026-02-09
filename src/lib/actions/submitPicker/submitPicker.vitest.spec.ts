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
                getPlayerGamesPlayedBeforeGameDay: vi.fn().mockImplementation((playerId: number) => playedByPlayer.get(playerId) ?? 0),
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
            playerId: 2,
            team: 'A',
        });
        expect(upsertPayloads).toContainEqual({
            gameDayId: 1249,
            playerId: 3,
            team: 'B',
        });
        expect(upsertPayloads).toContainEqual({
            gameDayId: 1249,
            playerId: 4,
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

    it('evaluates the full mirrored search space for 8-player splits', async () => {
        const adminRows: OutcomePlayerType[] = [
            createOutcomePlayer({ playerId: 12, name: 'P12', born: 1971, goalie: false }),
            createOutcomePlayer({ playerId: 190, name: 'P190', born: 1991, goalie: false }),
            createOutcomePlayer({ playerId: 191, name: 'P191', born: null, goalie: false }),
            createOutcomePlayer({ playerId: 193, name: 'P193', born: 1993, goalie: false }),
            createOutcomePlayer({ playerId: 196, name: 'P196', born: null, goalie: true }),
            createOutcomePlayer({ playerId: 200, name: 'P200', born: null, goalie: false }),
            createOutcomePlayer({ playerId: 201, name: 'P201', born: null, goalie: false }),
            createOutcomePlayer({ playerId: 239, name: 'P239', born: null, goalie: false }),
        ];
        const averageByPlayer = new Map([
            [12, 1.8],
            [190, 1.8],
            [191, 1.5],
            [193, 0.9],
            [196, 1.3],
            [200, 1.8],
            [201, 1.8],
            [239, 1.46],
        ]);

        const deps = {
            gameDayService: {
                getCurrent: vi.fn().mockResolvedValue(gameDay),
            },
            outcomeService: {
                getAdminByGameDay: vi.fn().mockResolvedValue(adminRows),
                getPlayerGamesPlayedBeforeGameDay: vi.fn().mockResolvedValue(10),
                getRecentAverage: vi.fn().mockImplementation((_gameDayId: number, playerId: number) => averageByPlayer.get(playerId) ?? 0),
                upsert: vi.fn().mockResolvedValue(null),
            },
            sendEmailToAllActivePlayers: vi.fn().mockResolvedValue({ recipientCount: 10 }),
            getPublicBaseUrl: () => 'https://example.test',
        };

        await SubmitPickerCore([
            { playerId: 12 },
            { playerId: 190 },
            { playerId: 191 },
            { playerId: 193 },
            { playerId: 196 },
            { playerId: 200 },
            { playerId: 201 },
            { playerId: 239 },
        ], deps);

        const predictedAssignments = new Map<number, TeamName>();
        for (const call of deps.outcomeService.upsert.mock.calls) {
            const payload = call[0] as { playerId: number; team: TeamName | null; };
            if (payload.team === 'A' || payload.team === 'B') {
                predictedAssignments.set(payload.playerId, payload.team);
            }
        }
        const predictedTeamA = Array.from(predictedAssignments.entries())
            .filter(([, team]) => team === 'A')
            .map(([playerId]) => playerId)
            .sort((left, right) => left - right);
        const predictedTeamB = Array.from(predictedAssignments.entries())
            .filter(([, team]) => team === 'B')
            .map(([playerId]) => playerId)
            .sort((left, right) => left - right);

        expect(predictedTeamA).toEqual([12, 193, 200, 201]);
        expect(predictedTeamB).toEqual([190, 191, 196, 239]);
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
                getPlayerGamesPlayedBeforeGameDay: vi.fn().mockImplementation((playerId: number) => playedByPlayer.get(playerId) ?? 0),
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
                getPlayerGamesPlayedBeforeGameDay: vi.fn(),
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
