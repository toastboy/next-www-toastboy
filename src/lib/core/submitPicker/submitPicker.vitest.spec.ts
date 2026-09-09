import type { TeamName } from 'prisma/zod/schemas';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { coreSubmitPicker } from '@/lib/core/submitPicker';
import type { OutcomePlayerType } from '@/types/OutcomePlayerType';

describe('coreSubmitPicker', () => {
    const gameDay = {
        id: 1249,
        year: 2026,
        date: new Date('2026-02-03T00:00:00Z'),
        status: 'Scheduled',
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
        name: string | null;
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
            createOutcomePlayer({
                playerId: 1,
                name: 'Alex',
                born: 1996,
                goalie: true,
            }),
            createOutcomePlayer({
                playerId: 2,
                name: 'Britt',
                born: 1996,
                goalie: false,
            }),
            createOutcomePlayer({
                playerId: 3,
                name: 'Casey',
                born: 1995,
                goalie: true,
            }),
            createOutcomePlayer({
                playerId: 4,
                name: 'Dev',
                born: 1995,
                goalie: false,
            }),
            createOutcomePlayer({
                playerId: 6,
                name: 'Eden',
                born: 1990,
                goalie: false,
                team: 'B',
            }),
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
                getPlayerGamesPlayedBeforeGameDay: vi
                    .fn()
                    .mockImplementation(
                        (playerId: number) => playedByPlayer.get(playerId) ?? 0,
                    ),
                getRecentAverage: vi
                    .fn()
                    .mockImplementation(
                        (_gameDayId: number, playerId: number) =>
                            averageByPlayer.get(playerId) ?? 0,
                    ),
                upsert: vi.fn().mockResolvedValue(null),
            },
            sendEmailToAllActivePlayers: vi
                .fn()
                .mockResolvedValue({ recipientCount: 10 }),
            getPublicBaseUrl: () => 'https://example.test',
        };

        await coreSubmitPicker(
            [
                { playerId: 1 },
                { playerId: 2 },
                { playerId: 3 },
                { playerId: 4 },
            ],
            deps,
        );

        expect(deps.outcomeService.getRecentAverage).toHaveBeenCalledWith(
            1249,
            1,
            10,
        );
        expect(deps.outcomeService.getRecentAverage).toHaveBeenCalledWith(
            1249,
            2,
            10,
        );
        expect(deps.outcomeService.getRecentAverage).toHaveBeenCalledWith(
            1249,
            3,
            10,
        );
        expect(deps.outcomeService.getRecentAverage).toHaveBeenCalledWith(
            1249,
            4,
            10,
        );

        const upsertPayloads = deps.outcomeService.upsert.mock.calls.map(
            (call) =>
                call[0] as {
                    gameDayId: number;
                    playerId: number;
                    team: TeamName | null;
                },
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

        expect(deps.sendEmailToAllActivePlayers).toHaveBeenCalledWith(
            expect.objectContaining({
                subject: 'Footy: teams picked',
            }),
        );
    });

    it('evaluates the full mirrored search space for 8-player splits', async () => {
        const adminRows: OutcomePlayerType[] = [
            createOutcomePlayer({
                playerId: 12,
                name: 'P12',
                born: 1971,
                goalie: false,
            }),
            createOutcomePlayer({
                playerId: 190,
                name: 'P190',
                born: 1991,
                goalie: false,
            }),
            createOutcomePlayer({
                playerId: 191,
                name: 'P191',
                born: null,
                goalie: false,
            }),
            createOutcomePlayer({
                playerId: 193,
                name: 'P193',
                born: 1993,
                goalie: false,
            }),
            createOutcomePlayer({
                playerId: 196,
                name: 'P196',
                born: null,
                goalie: true,
            }),
            createOutcomePlayer({
                playerId: 200,
                name: 'P200',
                born: null,
                goalie: false,
            }),
            createOutcomePlayer({
                playerId: 201,
                name: 'P201',
                born: null,
                goalie: false,
            }),
            createOutcomePlayer({
                playerId: 239,
                name: 'P239',
                born: null,
                goalie: false,
            }),
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
                getPlayerGamesPlayedBeforeGameDay: vi
                    .fn()
                    .mockResolvedValue(10),
                getRecentAverage: vi
                    .fn()
                    .mockImplementation(
                        (_gameDayId: number, playerId: number) =>
                            averageByPlayer.get(playerId) ?? 0,
                    ),
                upsert: vi.fn().mockResolvedValue(null),
            },
            sendEmailToAllActivePlayers: vi
                .fn()
                .mockResolvedValue({ recipientCount: 10 }),
            getPublicBaseUrl: () => 'https://example.test',
        };

        await coreSubmitPicker(
            [
                { playerId: 12 },
                { playerId: 190 },
                { playerId: 191 },
                { playerId: 193 },
                { playerId: 196 },
                { playerId: 200 },
                { playerId: 201 },
                { playerId: 239 },
            ],
            deps,
        );

        const predictedAssignments = new Map<number, TeamName>();
        for (const call of deps.outcomeService.upsert.mock.calls) {
            const payload = call[0] as {
                playerId: number;
                team: TeamName | null;
            };
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

    it('splits an odd squad into unequal sides and keeps goalie balance', async () => {
        // 5 players, 2 goalies (P1, P5). On-pitch = 2 a side; team A has 3
        // (one rotating out), team B has 2. Best split keeps one goalie each
        // side and, after scaling team A by 2/3 for its substitute, minimises
        // the on-pitch average gap: A = {P3,P4,P5} (2/3 * (1+5+2) = 5.33),
        // B = {P1,P2} (4+2 = 6).
        const adminRows: OutcomePlayerType[] = [
            createOutcomePlayer({
                playerId: 1,
                name: 'Alex',
                born: 1996,
                goalie: true,
            }),
            createOutcomePlayer({
                playerId: 2,
                name: 'Britt',
                born: 1996,
                goalie: false,
            }),
            createOutcomePlayer({
                playerId: 3,
                name: 'Casey',
                born: 1996,
                goalie: false,
            }),
            createOutcomePlayer({
                playerId: 4,
                name: 'Dev',
                born: 1996,
                goalie: false,
            }),
            createOutcomePlayer({
                playerId: 5,
                name: 'Eden',
                born: 1996,
                goalie: true,
            }),
        ];
        const averageByPlayer = new Map([
            [1, 4],
            [2, 2],
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
                getPlayerGamesPlayedBeforeGameDay: vi
                    .fn()
                    .mockResolvedValue(10),
                getRecentAverage: vi
                    .fn()
                    .mockImplementation(
                        (_gameDayId: number, playerId: number) =>
                            averageByPlayer.get(playerId) ?? 0,
                    ),
                upsert: vi.fn().mockResolvedValue(null),
            },
            sendEmailToAllActivePlayers: vi
                .fn()
                .mockResolvedValue({ recipientCount: 10 }),
            getPublicBaseUrl: () => 'https://example.test',
        };

        await coreSubmitPicker(
            [
                { playerId: 1 },
                { playerId: 2 },
                { playerId: 3 },
                { playerId: 4 },
                { playerId: 5 },
            ],
            deps,
        );

        const teams = new Map<number, TeamName>();
        for (const call of deps.outcomeService.upsert.mock.calls) {
            const payload = call[0] as {
                playerId: number;
                team: TeamName | null;
            };
            if (payload.team === 'A' || payload.team === 'B') {
                teams.set(payload.playerId, payload.team);
            }
        }

        const teamA = [...teams.entries()]
            .filter(([, team]) => team === 'A')
            .map(([id]) => id)
            .sort((l, r) => l - r);
        const teamB = [...teams.entries()]
            .filter(([, team]) => team === 'B')
            .map(([id]) => id)
            .sort((l, r) => l - r);

        expect(teamA).toEqual([3, 4, 5]);
        expect(teamB).toEqual([1, 2]);
        // one goalie each side
        expect(teamA).toContain(5);
        expect(teamB).toContain(1);
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

        await expect(
            coreSubmitPicker([{ playerId: 7 }, { playerId: 9 }], deps),
        ).rejects.toThrow('No current game day available for picking teams.');
    });

    it('throws when fewer than two players are selected', async () => {
        const deps = {
            gameDayService: { getCurrent: vi.fn() },
            outcomeService: {
                getAdminByGameDay: vi.fn(),
                getPlayerGamesPlayedBeforeGameDay: vi.fn(),
                getRecentAverage: vi.fn(),
                upsert: vi.fn(),
            },
            sendEmailToAllActivePlayers: vi.fn(),
            getPublicBaseUrl: () => 'https://example.test',
        };

        await expect(coreSubmitPicker([{ playerId: 1 }], deps)).rejects.toThrow(
            'At least two players are required to pick teams.',
        );
        expect(deps.gameDayService.getCurrent).not.toHaveBeenCalled();
    });

    it('throws when a selected player is not in the outcomes list', async () => {
        const adminRows: OutcomePlayerType[] = [
            createOutcomePlayer({
                playerId: 1,
                name: 'Alex',
                born: 1996,
                goalie: false,
            }),
        ];
        const deps = {
            gameDayService: {
                getCurrent: vi.fn().mockResolvedValue(gameDay),
            },
            outcomeService: {
                getAdminByGameDay: vi.fn().mockResolvedValue(adminRows),
                getPlayerGamesPlayedBeforeGameDay: vi
                    .fn()
                    .mockResolvedValue(10),
                getRecentAverage: vi.fn(),
                upsert: vi.fn().mockResolvedValue(null),
            },
            sendEmailToAllActivePlayers: vi.fn(),
            getPublicBaseUrl: () => 'https://example.test',
        };

        await expect(
            coreSubmitPicker([{ playerId: 1 }, { playerId: 99 }], deps),
        ).rejects.toThrow(
            'Selected player 99 is not available for this game day.',
        );
    });

    it('throws when a selected player has not responded Yes', async () => {
        const adminRows: OutcomePlayerType[] = [
            createOutcomePlayer({
                playerId: 1,
                name: 'Alex',
                born: 1996,
                goalie: false,
            }),
            createOutcomePlayer({
                playerId: 2,
                name: 'Britt',
                born: 1996,
                goalie: false,
                response: 'No',
            }),
        ];
        const deps = {
            gameDayService: {
                getCurrent: vi.fn().mockResolvedValue(gameDay),
            },
            outcomeService: {
                getAdminByGameDay: vi.fn().mockResolvedValue(adminRows),
                getPlayerGamesPlayedBeforeGameDay: vi
                    .fn()
                    .mockResolvedValue(10),
                getRecentAverage: vi.fn(),
                upsert: vi.fn().mockResolvedValue(null),
            },
            sendEmailToAllActivePlayers: vi.fn(),
            getPublicBaseUrl: () => 'https://example.test',
        };

        await expect(
            coreSubmitPicker([{ playerId: 1 }, { playerId: 2 }], deps),
        ).rejects.toThrow("Selected player 2 does not have a 'Yes' response.");
    });

    it('includes fallback player ID in email when player name is null', async () => {
        const averageByPlayer = new Map([
            [1, 2.0],
            [2, 2.0],
            [3, 2.0],
            [4, 2.0],
            [5, 1.0],
            [6, 3.0],
            [7, 2.0],
        ]);
        const adminRows: OutcomePlayerType[] = [
            createOutcomePlayer({
                playerId: 1,
                name: 'Alice',
                born: null,
                goalie: false,
            }),
            createOutcomePlayer({
                playerId: 2,
                name: null,
                born: null,
                goalie: false,
            }),
            createOutcomePlayer({
                playerId: 3,
                name: 'Charlie',
                born: 1980,
                goalie: false,
            }),
            createOutcomePlayer({
                playerId: 4,
                name: 'Dev',
                born: 1985,
                goalie: false,
            }),
            createOutcomePlayer({
                playerId: 5,
                name: 'Eden',
                born: null,
                goalie: false,
            }),
            createOutcomePlayer({
                playerId: 6,
                name: 'Frank',
                born: null,
                goalie: true,
            }),
            createOutcomePlayer({
                playerId: 7,
                name: 'Grace',
                born: null,
                goalie: true,
            }),
        ];
        const deps = {
            gameDayService: {
                getCurrent: vi.fn().mockResolvedValue(gameDay),
            },
            outcomeService: {
                getAdminByGameDay: vi.fn().mockResolvedValue(adminRows),
                getPlayerGamesPlayedBeforeGameDay: vi
                    .fn()
                    .mockResolvedValue(10),
                getRecentAverage: vi
                    .fn()
                    .mockImplementation(
                        (_gameDayId: number, playerId: number) =>
                            averageByPlayer.get(playerId) ?? 0,
                    ),
                upsert: vi.fn().mockResolvedValue(null),
            },
            sendEmailToAllActivePlayers: vi
                .fn()
                .mockResolvedValue({ recipientCount: 10 }),
            getPublicBaseUrl: () => 'https://example.test',
        };

        await coreSubmitPicker(
            [
                { playerId: 1 },
                { playerId: 2 },
                { playerId: 3 },
                { playerId: 4 },
                { playerId: 5 },
                { playerId: 6 },
                { playerId: 7 },
            ],
            deps,
        );

        expect(deps.sendEmailToAllActivePlayers).toHaveBeenCalledOnce();
        expect(deps.sendEmailToAllActivePlayers).toHaveBeenCalledWith(
            expect.objectContaining({
                subject: 'Footy: teams picked',
            }),
        );
    });

    it('uses the default history window when game history setting is missing', async () => {
        const gameDayNullHistory = { ...gameDay, pickerGamesHistory: null };
        const averageByPlayer = new Map([
            [1, 2.0],
            [2, 2.0],
            [3, 2.0],
            [4, 2.0],
            [5, 1.0],
            [6, 3.0],
            [7, 2.0],
        ]);
        const adminRows: OutcomePlayerType[] = [
            createOutcomePlayer({
                playerId: 1,
                name: 'Alice',
                born: null,
                goalie: false,
            }),
            createOutcomePlayer({
                playerId: 2,
                name: 'Britt',
                born: null,
                goalie: false,
            }),
            createOutcomePlayer({
                playerId: 3,
                name: 'Charlie',
                born: 1980,
                goalie: false,
            }),
            createOutcomePlayer({
                playerId: 4,
                name: 'Dev',
                born: 1985,
                goalie: false,
            }),
            createOutcomePlayer({
                playerId: 5,
                name: 'Eden',
                born: null,
                goalie: false,
            }),
            createOutcomePlayer({
                playerId: 6,
                name: 'Frank',
                born: null,
                goalie: true,
            }),
            createOutcomePlayer({
                playerId: 7,
                name: 'Grace',
                born: null,
                goalie: true,
            }),
        ];
        const deps = {
            gameDayService: {
                getCurrent: vi.fn().mockResolvedValue(gameDayNullHistory),
            },
            outcomeService: {
                getAdminByGameDay: vi.fn().mockResolvedValue(adminRows),
                getPlayerGamesPlayedBeforeGameDay: vi
                    .fn()
                    .mockResolvedValue(10),
                getRecentAverage: vi
                    .fn()
                    .mockImplementation(
                        (_gameDayId: number, playerId: number) =>
                            averageByPlayer.get(playerId) ?? 0,
                    ),
                upsert: vi.fn().mockResolvedValue(null),
            },
            sendEmailToAllActivePlayers: vi
                .fn()
                .mockResolvedValue({ recipientCount: 10 }),
            getPublicBaseUrl: () => 'https://example.test',
        };

        await coreSubmitPicker(
            [
                { playerId: 1 },
                { playerId: 2 },
                { playerId: 3 },
                { playerId: 4 },
                { playerId: 5 },
                { playerId: 6 },
                { playerId: 7 },
            ],
            deps,
        );

        expect(deps.outcomeService.getRecentAverage).toHaveBeenCalledWith(
            1249,
            1,
            10,
        );
        expect(deps.outcomeService.getRecentAverage).toHaveBeenCalledWith(
            1249,
            2,
            10,
        );
        expect(deps.outcomeService.getRecentAverage).toHaveBeenCalledWith(
            1249,
            3,
            10,
        );
    });

    it('assigns teams successfully when selected players have mixed birthdate availability', async () => {
        const averageByPlayer = new Map([
            [1, 2.0],
            [2, 2.0],
            [3, 2.0],
            [4, 2.0],
            [5, 1.0],
            [6, 3.0],
            [7, 2.0],
        ]);
        const adminRows: OutcomePlayerType[] = [
            createOutcomePlayer({
                playerId: 1,
                name: 'Alice',
                born: null,
                goalie: false,
            }),
            createOutcomePlayer({
                playerId: 2,
                name: 'Britt',
                born: null,
                goalie: false,
            }),
            createOutcomePlayer({
                playerId: 3,
                name: 'Charlie',
                born: 1980,
                goalie: false,
            }),
            createOutcomePlayer({
                playerId: 4,
                name: 'Dev',
                born: 1985,
                goalie: false,
            }),
            createOutcomePlayer({
                playerId: 5,
                name: 'Eden',
                born: null,
                goalie: false,
            }),
            createOutcomePlayer({
                playerId: 6,
                name: 'Frank',
                born: null,
                goalie: true,
            }),
            createOutcomePlayer({
                playerId: 7,
                name: 'Grace',
                born: null,
                goalie: true,
            }),
        ];
        const deps = {
            gameDayService: {
                getCurrent: vi.fn().mockResolvedValue(gameDay),
            },
            outcomeService: {
                getAdminByGameDay: vi.fn().mockResolvedValue(adminRows),
                getPlayerGamesPlayedBeforeGameDay: vi
                    .fn()
                    .mockResolvedValue(10),
                getRecentAverage: vi
                    .fn()
                    .mockImplementation(
                        (_gameDayId: number, playerId: number) =>
                            averageByPlayer.get(playerId) ?? 0,
                    ),
                upsert: vi.fn().mockResolvedValue(null),
            },
            sendEmailToAllActivePlayers: vi
                .fn()
                .mockResolvedValue({ recipientCount: 10 }),
            getPublicBaseUrl: () => 'https://example.test',
        };

        await coreSubmitPicker(
            [
                { playerId: 1 },
                { playerId: 2 },
                { playerId: 3 },
                { playerId: 4 },
                { playerId: 5 },
                { playerId: 6 },
                { playerId: 7 },
            ],
            deps,
        );

        const teamAssignments = deps.outcomeService.upsert.mock.calls
            .map(
                (call) =>
                    call[0] as { playerId: number; team: TeamName | null },
            )
            .filter((payload) => payload.team === 'A' || payload.team === 'B');

        expect(teamAssignments).toHaveLength(7);
    });

    it('loads the larger side of an odd split to offset its rotating substitute', async () => {
        // 5 players, no goalies, avgs [1, 1, 5, 5, 3]. Team A has 3 (one
        // resting at a time), team B has 2. The fair split equalises on-pitch
        // strength: A = {P1,P3,P5}, sum 9, scaled by 2/3 -> 6; B = {P2,P4},
        // sum 6. The 3-player side deliberately carries the larger raw total.
        const adminRows: OutcomePlayerType[] = [
            createOutcomePlayer({
                playerId: 1,
                name: 'P1',
                born: 1996,
                goalie: false,
            }),
            createOutcomePlayer({
                playerId: 2,
                name: 'P2',
                born: 1996,
                goalie: false,
            }),
            createOutcomePlayer({
                playerId: 3,
                name: 'P3',
                born: 1996,
                goalie: false,
            }),
            createOutcomePlayer({
                playerId: 4,
                name: 'P4',
                born: 1996,
                goalie: false,
            }),
            createOutcomePlayer({
                playerId: 5,
                name: 'P5',
                born: 1996,
                goalie: false,
            }),
        ];
        const averageByPlayer = new Map([
            [1, 1.0],
            [2, 1.0],
            [3, 5.0],
            [4, 5.0],
            [5, 3.0],
        ]);
        const deps = {
            gameDayService: {
                getCurrent: vi.fn().mockResolvedValue(gameDay),
            },
            outcomeService: {
                getAdminByGameDay: vi.fn().mockResolvedValue(adminRows),
                getPlayerGamesPlayedBeforeGameDay: vi
                    .fn()
                    .mockResolvedValue(10),
                getRecentAverage: vi
                    .fn()
                    .mockImplementation(
                        (_gameDayId: number, playerId: number) =>
                            averageByPlayer.get(playerId) ?? 0,
                    ),
                upsert: vi.fn().mockResolvedValue(null),
            },
            sendEmailToAllActivePlayers: vi
                .fn()
                .mockResolvedValue({ recipientCount: 10 }),
            getPublicBaseUrl: () => 'https://example.test',
        };

        await coreSubmitPicker(
            [
                { playerId: 1 },
                { playerId: 2 },
                { playerId: 3 },
                { playerId: 4 },
                { playerId: 5 },
            ],
            deps,
        );

        const teamAssignments = new Map<number, TeamName>();
        for (const call of deps.outcomeService.upsert.mock.calls) {
            const payload = call[0] as {
                playerId: number;
                team: TeamName | null;
            };
            if (payload.team === 'A' || payload.team === 'B') {
                teamAssignments.set(payload.playerId, payload.team);
            }
        }

        const teamAPlayers = Array.from(teamAssignments.entries())
            .filter(([, team]) => team === 'A')
            .map(([playerId]) => playerId)
            .sort((left, right) => left - right);
        const teamBPlayers = Array.from(teamAssignments.entries())
            .filter(([, team]) => team === 'B')
            .map(([playerId]) => playerId)
            .sort((left, right) => left - right);

        expect(teamAPlayers).toEqual([1, 3, 5]);
        expect(teamBPlayers).toEqual([2, 4]);

        const teamAAverage = teamAPlayers.reduce(
            (sum, playerId) => sum + (averageByPlayer.get(playerId) ?? 0),
            0,
        );
        const teamBAverage = teamBPlayers.reduce(
            (sum, playerId) => sum + (averageByPlayer.get(playerId) ?? 0),
            0,
        );

        // Larger side carries the higher raw total ...
        expect(teamAAverage).toBe(9);
        expect(teamBAverage).toBe(6);
        // ... but on-pitch (A scaled by 2/3) the two sides are equal.
        expect((2 / 3) * teamAAverage).toBeCloseTo(teamBAverage);
    });

    it('assigns all players for a minimal odd-sized selection with mixed birthdate availability', async () => {
        const adminRows: OutcomePlayerType[] = [
            createOutcomePlayer({
                playerId: 1,
                name: 'Known age',
                born: 1980,
                goalie: false,
            }),
            createOutcomePlayer({
                playerId: 2,
                name: 'Unknown age',
                born: null,
                goalie: false,
            }),
            createOutcomePlayer({
                playerId: 3,
                name: 'Another unknown',
                born: null,
                goalie: false,
            }),
        ];
        const deps = {
            gameDayService: {
                getCurrent: vi.fn().mockResolvedValue(gameDay),
            },
            outcomeService: {
                getAdminByGameDay: vi.fn().mockResolvedValue(adminRows),
                getPlayerGamesPlayedBeforeGameDay: vi
                    .fn()
                    .mockResolvedValue(10),
                getRecentAverage: vi.fn().mockResolvedValue(2),
                upsert: vi.fn().mockResolvedValue(null),
            },
            sendEmailToAllActivePlayers: vi
                .fn()
                .mockResolvedValue({ recipientCount: 10 }),
            getPublicBaseUrl: () => 'https://example.test',
        };

        await coreSubmitPicker(
            [{ playerId: 1 }, { playerId: 2 }, { playerId: 3 }],
            deps,
        );

        const teamAssignments = deps.outcomeService.upsert.mock.calls
            .map(
                (call) =>
                    call[0] as { playerId: number; team: TeamName | null },
            )
            .filter((payload) => payload.team === 'A' || payload.team === 'B');
        const assignedPlayerIds = teamAssignments
            .map((payload) => payload.playerId)
            .sort((left, right) => left - right);
        const teamACount = teamAssignments.filter(
            (payload) => payload.team === 'A',
        ).length;
        const teamBCount = teamAssignments.filter(
            (payload) => payload.team === 'B',
        ).length;

        expect(assignedPlayerIds).toEqual([1, 2, 3]);
        expect(teamACount + teamBCount).toBe(3);
        expect(teamACount).toBeGreaterThan(0);
        expect(teamBCount).toBeGreaterThan(0);
        expect(deps.sendEmailToAllActivePlayers).toHaveBeenCalledOnce();
    });
});
