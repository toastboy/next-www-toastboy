import prisma from 'prisma/prisma';
import {
    OutcomeWhereUniqueInputObjectSchema,
    PlayerResponseSchema,
    TeamName,
    TeamNameSchema,
} from 'prisma/zod/schemas';
import {
    OutcomeType,
} from 'prisma/zod/schemas/models/Outcome.schema';
import {
    TeamPlayerSchema,
    TeamPlayerType,
    Turnout,
    TurnoutByYearType,
    WDLType,
} from 'types';
import z from 'zod';

import { normalizeUnknownError } from '@/lib/errors';
import { isPrismaNotFoundError } from '@/lib/prismaErrors';
import gameDayService from '@/services/GameDay';
import { OutcomePlayerType } from '@/types/OutcomePlayerType';
import {
    OutcomeCreateOneStrictSchema,
    OutcomeUpsertOneStrictSchema,
    type OutcomeWriteInput,
    OutcomeWriteInputSchema,
} from '@/types/OutcomeStrictSchema';


export class OutcomeService {
    /**
     * Retrieves an Outcome for the given Player ID for the given GameDay ID.
     * @param gameDayId - The ID of the GameDay.
     * @param playerId - The ID of the Player.
     * @returns A promise that resolves to the Outcome if found, otherwise null.
     * @throws An error if there is a failure.
     */
    async get(gameDayId: number, playerId: number): Promise<OutcomeType | null> {
        try {
            const where = OutcomeWhereUniqueInputObjectSchema.parse({
                gameDayId_playerId: {
                    gameDayId: gameDayId,
                    playerId: playerId,
                },
            });

            return prisma.outcome.findUnique({ where });
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Retrieves all outcomes.
     * @returns A promise that resolves to an array of outcomes or null if an error occurs.
     * @throws An error if there is a failure.
     */
    async getAll(): Promise<OutcomeType[]> {
        try {
            return prisma.outcome.findMany({});
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Retrieves the last played outcome.
     * @returns A Promise that resolves to the last played Outcome, or null if no outcome is found.
     * @throws An error if there is a failure.
     */
    async getLastPlayed(): Promise<OutcomeType | null> {
        try {
            return prisma.outcome.findFirst({
                where: {
                    points: {
                        not: null,
                    },
                },
                orderBy: {
                    gameDayId: 'desc',
                },
            });
        }
        catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Retrieves all the outcomes for gameDays in a given year, or all years if
     * `year` is zero.
     * @param year - The year to include, or zero for all year.
     * @param untilGameDay - The gameDay ID to stop at (inclusive), or undefined
     * to include all.
     * @returns A promise that resolves to an array of Outcomes sorted by
     * gameDay, most recent first.
     * @throws An error if there is a failure.
     */
    async getAllForYear(year: number, untilGameDay?: number): Promise<OutcomeType[]> {
        try {
            return prisma.outcome.findMany({
                where: {
                    gameDay: {
                        date: year !== 0 ? {
                            gte: new Date(year, 0, 1),
                            lt: new Date(year + 1, 0, 1),
                        } : {},
                        id: untilGameDay ? {
                            lte: untilGameDay,
                        } : {},
                    },
                },
                orderBy: {
                    gameDayId: 'desc',
                },
            });
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Retrieves the response counts for a specific game day or all game days.
     *
     * @param gameDayId - Optional. The ID of the game day to retrieve response counts for.
     * @returns An array of game days with their corresponding response counts.
     * @throws If there is an error fetching the outcomes.
     */
    async getResponseCounts(gameDayId?: number) {
        try {
            return await prisma.outcome.groupBy({
                orderBy: {
                    gameDayId: 'asc',
                },
                where: {
                    ...(gameDayId ? { gameDayId: gameDayId } : {}),
                },
                by: [
                    'response',
                    'gameDayId',
                ],
                _count: {
                    response: true,
                    team: true,
                },
            });
        }
        catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Retrieves the turnout for a specific game day or all game days.
     *
     * @param gameDayId - Optional. The ID of the game day to retrieve turnout for.
     * @returns An array of game days with their corresponding response counts.
     * @throws If there is an error fetching the outcomes.
     */
    async getTurnout(gameDayId?: number): Promise<Turnout[]> {
        try {
            const responseCounts = await this.getResponseCounts(gameDayId);

            let gameDays = [];
            if (gameDayId === undefined) {
                gameDays = await gameDayService.getAll();
            }
            else {
                gameDays.push(await gameDayService.get(gameDayId));
            }

            const result = gameDays.map((gameDay) => {
                const initialResponseCounts = new Map<string, number>([
                    ['yes', 0],
                    ['no', 0],
                    ['dunno', 0],
                    ['excused', 0],
                    ['flaked', 0],
                    ['injured', 0],
                ]);
                const gameDayResponseCounts = PlayerResponseSchema.options.reduce((map, response) => {
                    const count = responseCounts
                        .filter((res) =>
                            res.gameDayId === gameDay?.id &&
                            res.response === `${response}`)
                        .map((res) => res._count.response)[0] || 0;
                    map.set(`${response.toLowerCase()}`, count);
                    return map;
                }, initialResponseCounts);

                if (gameDay) {
                    return {
                        ...gameDay,
                        yes: gameDayResponseCounts.get('yes'),
                        no: gameDayResponseCounts.get('no'),
                        dunno: gameDayResponseCounts.get('dunno'),
                        excused: gameDayResponseCounts.get('excused'),
                        flaked: gameDayResponseCounts.get('flaked'),
                        injured: gameDayResponseCounts.get('injured'),
                        responses: responseCounts
                            .filter((rc) => rc.gameDayId === gameDay.id && rc.response !== null)
                            .reduce((acc, rc) => acc + rc._count.response, 0),
                        players: responseCounts
                            .filter((rc) => rc.gameDayId === gameDay.id && rc.response === PlayerResponseSchema.enum.Yes)
                            .map((rc) => rc._count.team)[0] || 0,
                        cancelled: gameDay.mailSent !== null && !gameDay.game,
                    };
                }
            });

            return result as Turnout[];
        }
        catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Retrieves the turnout data by year.
     * @returns A promise that resolves to an array of `TurnoutByYear` objects.
     * @throws If there is an error fetching the outcomes.
     */
    async getTurnoutByYear(): Promise<TurnoutByYearType[]> {
        try {
            const turnout = await this.getTurnout();
            const gameYears = await gameDayService.getAllYears();

            return Promise.resolve(gameYears.map((gameYear) => {
                const yearTurnout = turnout.filter((t) => gameYear === t.year);
                const result: TurnoutByYearType = {
                    year: gameYear,
                    gameDays: yearTurnout.length,
                    gamesScheduled: yearTurnout.filter((t) => t.game || t.mailSent).length,
                    gamesInitiated: yearTurnout.filter((t) => t.mailSent).length,
                    gamesPlayed: yearTurnout.filter((t) => t.game && t.mailSent).length,
                    gamesCancelled: yearTurnout.filter((t) => t.cancelled).length,
                    responses: yearTurnout.reduce((acc, t) => acc + t.responses, 0),
                    yesses: yearTurnout.reduce((acc, t) => acc + t.yes, 0),
                    players: yearTurnout.reduce((acc, t) => acc + t.players, 0),
                    responsesPerGameInitiated: 0,
                    yessesPerGameInitiated: 0,
                    playersPerGamePlayed: 0,
                };

                if (result.gamesInitiated > 0) {
                    result.responsesPerGameInitiated = parseFloat((result.responses / result.gamesInitiated).toFixed(1));
                    result.yessesPerGameInitiated = parseFloat((result.yesses / result.gamesInitiated).toFixed(1));
                }
                if (result.gamesPlayed > 0) {
                    result.playersPerGamePlayed = parseFloat((result.players / result.gamesPlayed).toFixed(1));
                }

                return result;
            }));
        }
        catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Retrieves outcomes by game day ID and, optionally, team.
     * @param gameDayId - The ID of the game day.
     * @param team - Optional team ('A' or 'B').
     * @returns A promise that resolves to an array of Outcome objects.
     * @throws If there is an error fetching the outcomes.
     */
    async getByGameDay(gameDayId: number, team?: 'A' | 'B'): Promise<OutcomePlayerType[]> {
        try {
            return prisma.outcome.findMany({
                where: {
                    gameDayId,
                    team,
                },
                include: {
                    player: true,
                },
            });
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Retrieves admin response rows for a game day, including active players
     * who do not yet have an Outcome for that game day.
     * @param gameDayId - The ID of the game day.
     * @returns A promise that resolves to one row per active player.
     * @throws If there is an error fetching the data.
     */
    async getAdminByGameDay(gameDayId: number): Promise<OutcomePlayerType[]> {
        try {
            const validatedGameDayId = z.number().int().min(1).parse(gameDayId);

            const activePlayers = await prisma.player.findMany({
                where: {
                    finished: null,
                },
                orderBy: [
                    { name: 'asc' },
                    { id: 'asc' },
                ],
                include: {
                    outcomes: {
                        where: {
                            gameDayId: validatedGameDayId,
                        },
                        take: 1,
                    },
                },
            });

            return activePlayers.map(({ outcomes, ...player }) => {
                const outcome = outcomes[0];
                if (outcome) {
                    return OutcomePlayerType.parse({
                        ...outcome,
                        player,
                    });
                }

                return OutcomePlayerType.parse({
                    id: -player.id,
                    gameDayId: validatedGameDayId,
                    playerId: player.id,
                    response: null,
                    responseInterval: null,
                    points: null,
                    team: null,
                    comment: null,
                    pub: null,
                    paid: null,
                    goalie: null,
                    player,
                });
            });
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Retrieves all players on a given team for a specific game day, including
     * their outcome for that day and their recent form.
     * @param gameDayId - The game day identifier.
     * @param team - Team to fetch ('A' or 'B').
     * @param formHistory - Number of previous games to include in each
     * player's form graph (default 5).
     * @returns A promise resolving to the enriched player records.
     * @throws If there is an error fetching the data.
     */
    async getTeamPlayersByGameDay(
        gameDayId: number,
        team: TeamName,
        formHistory = 5,
    ): Promise<TeamPlayerType[]> {
        try {
            const validatedGameDayId = z.number().int().min(1).parse(gameDayId);
            const validatedTeam = TeamNameSchema.parse(team);
            const validatedHistory = z.number().int().min(0).parse(formHistory);

            const outcomes = await prisma.outcome.findMany({
                where: {
                    gameDayId: validatedGameDayId,
                    team: validatedTeam,
                },
                include: {
                    player: {
                        include: {
                            outcomes: {
                                where: {
                                    gameDayId: {
                                        lt: validatedGameDayId,
                                    },
                                    points: {
                                        not: null,
                                    },
                                },
                                orderBy: {
                                    gameDayId: 'desc',
                                },
                                take: validatedHistory,
                                include: {
                                    gameDay: true,
                                },
                            },
                        },
                    },
                },
            });

            return outcomes.map(({ player, ...outcome }) => {
                if (!player) {
                    throw new Error(`Outcome ${outcome.id} is missing its player relation`);
                }
                const { outcomes: form = [], ...playerData } = player;

                return TeamPlayerSchema.parse({
                    ...playerData,
                    outcome,
                    form,
                });
            });
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Retrieves outcomes by player ID.
     * @param playerId - The ID of the player.
     * @returns A promise that resolves to an array of outcomes.
     * @throws An error if there is a failure.
     */
    async getByPlayer(playerId: number): Promise<OutcomeType[]> {
        try {
            return prisma.outcome.findMany({
                where: {
                    playerId: playerId,
                },
            });
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Retrieves the recent points list for a player before a specific game day.
     *
     * Mirrors the legacy `player_recent_game_points` stored procedure:
     * - only outcomes before `gameDayId`
     * - only rows with a team assigned
     * - newest game first
     * - maximum 10 rows
     *
     * @param gameDayId - The current game day ID.
     * @param playerId - The player ID.
     * @returns A promise that resolves to the selected points values.
     * @throws An error if there is a failure.
     */
    async getRecentGamePoints(
        gameDayId: number,
        playerId: number,
    ): Promise<(number | null)[]> {
        try {
            const parsed = z.object({
                gameDayId: z.number().int().min(1),
                playerId: z.number().int().min(1),
            }).parse({ gameDayId, playerId });

            const outcomes = await prisma.outcome.findMany({
                where: {
                    gameDayId: {
                        lt: parsed.gameDayId,
                    },
                    playerId: parsed.playerId,
                    team: {
                        not: null,
                    },
                },
                orderBy: {
                    gameDayId: 'desc',
                },
                take: 10,
                select: {
                    points: true,
                },
            });

            return outcomes.map((outcome) => outcome.points);
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Calculates a player's recent average for picker logic using the legacy
     * PHP behavior:
     * - use recent game points before `gameDayId`
     * - include at most `history` rows from that list
     * - if fewer than `history` games exist, credit 1.45 points per missing game
     *
     * @param gameDayId - The current game day ID.
     * @param playerId - The player ID.
     * @param history - Number of recent games to consider.
     * @returns A promise resolving to the recent average.
     * @throws An error if there is a failure.
     */
    async getRecentAverage(
        gameDayId: number,
        playerId: number,
        history: number,
    ): Promise<number> {
        try {
            const parsed = z.object({
                gameDayId: z.number().int().min(1),
                playerId: z.number().int().min(1),
                history: z.number().int().min(1),
            }).parse({ gameDayId, playerId, history });

            const points = await this.getRecentGamePoints(
                parsed.gameDayId,
                parsed.playerId,
            );

            let total = 0;
            let count = 0;
            for (const point of points) {
                total += point ?? 0;
                count++;
                if (count === parsed.history) break;
            }

            total += 1.45 * (parsed.history - count);
            return total / parsed.history;
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Retrieves the total number of games where a player was assigned a team.
     *
     * Mirrors the legacy `player_games_played` SQL function:
     * - count outcomes where `team` is not null for the given player.
     *
     * @param playerId - The player ID.
     * @returns A promise resolving to the total count.
     * @throws An error if there is a failure.
     */
    async getPlayerGamesPlayed(playerId: number): Promise<number> {
        try {
            const parsedPlayerId = z.number().int().min(1).parse(playerId);

            return prisma.outcome.count({
                where: {
                    playerId: parsedPlayerId,
                    team: {
                        not: null,
                    },
                },
            });
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Retrieves the total number of games where a player was assigned a team
     * before a specific game day.
     *
     * Use this for historical picker parity where `played` should reflect
     * what was known at picker run-time for that game.
     *
     * @param playerId - The player ID.
     * @param gameDayId - The game day ID used as an exclusive upper bound.
     * @returns A promise resolving to the total count.
     * @throws An error if there is a failure.
     */
    async getPlayerGamesPlayedBeforeGameDay(
        playerId: number,
        gameDayId: number,
    ): Promise<number> {
        try {
            const parsed = z.object({
                playerId: z.number().int().min(1),
                gameDayId: z.number().int().min(1),
            }).parse({ playerId, gameDayId });

            return prisma.outcome.count({
                where: {
                    playerId: parsed.playerId,
                    team: {
                        not: null,
                    },
                    gameDayId: {
                        lt: parsed.gameDayId,
                    },
                },
            });
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Retrieves the number of games played by player ID in the given year,
     * optionally stopping at a given gameDay ID.
     * @param playerId - The ID of the player.
     * @param year - The year to filter by, or zero for all years.
     * @param untilGameDayId - The gameDay ID to stop at (inclusive), or
     * undefined
     * @returns A promise that resolves to the number of games or null.
     * @throws An error if there is a failure.
     */
    async getGamesPlayedByPlayer(playerId: number, year: number, untilGameDayId?: number): Promise<number> {
        try {
            return prisma.outcome.count({
                where: {
                    playerId: playerId,
                    points: {
                        not: null,
                    },
                    gameDay: {
                        ...(year !== 0 ? {
                            date: {
                                gte: new Date(year, 0, 1),
                                lt: new Date(year + 1, 0, 1),
                            },
                        } : {}),
                        ...(untilGameDayId ? {
                            id: {
                                lte: untilGameDayId,
                            },
                        } : {}),
                    },
                },
            });
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Retrieves the latest game played in a given year.
     * @param year - The year for which to retrieve the latest game.
     * @returns A Promise that resolves to the gameDayId of the latest game
     * played in the given year, or null if no games were played.
     * @throws If there was an error while fetching the latest game.
     */
    async getLatestGamePlayedByYear(year: number): Promise<number | null> {
        try {
            const outcomes = await prisma.outcome.findMany({
                where: {
                    points: {
                        not: null,
                    },
                    ...(year != 0 ? {
                        gameDay: {
                            date: {
                                gte: new Date(year, 0, 1),
                                lt: new Date(year + 1, 0, 1),
                            },
                        },
                    } : {}),
                },
                orderBy: {
                    gameDayId: 'desc',
                },
                take: 1,
            });
            if (outcomes.length === 0) {
                return null;
            }
            return outcomes[0].gameDayId;
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Retrieves the win-draw-loss (WDL) statistics for team 'A' based on the bibs each game.
     *
     * @param {Object} params - The parameters for the query.
     * @param {number} [params.year] - The specific year to filter the game days. If not provided, all years are considered.
     * @returns {Promise<WDLType>} A promise that resolves to an object containing the counts of games won, drawn, and lost.
     * @throws Will throw an error if there is an issue fetching the WDL counts.
     */
    async getByBibs({ year }: { year?: number }): Promise<WDLType> {
        try {
            const gameDays = await gameDayService.getAll();
            const outcomes = await prisma.outcome.groupBy({
                where: {
                    team: 'A',
                },
                by: [
                    'gameDayId',
                    'team',
                    'points',
                ],
            });

            // Count the number of games won, drawn, and lost by the team with
            // the bibs each game
            const wdl = outcomes.reduce((acc, outcome) => {
                const gameDay = gameDays.find((gameDay) => gameDay.id === outcome.gameDayId);
                if (gameDay &&
                    gameDay.bibs !== null &&
                    outcome.points !== null &&
                    (!year || gameDay.year === year)) {
                    if (outcome.points === 1) {
                        acc.drawn++;
                    } else {
                        if (gameDay.bibs == "A") {
                            if (outcome.points === 0) acc.lost++; else acc.won++;
                        } else {
                            if (outcome.points === 3) acc.lost++; else acc.won++;
                        }
                    }
                }
                return acc;
            }, { won: 0, drawn: 0, lost: 0 });

            return wdl;
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Creates an outcome from validated write input.
     * @param data - Write payload keyed by `gameDayId` and `playerId`.
     * @returns The created outcome row.
     * @throws {z.ZodError} If input or Prisma-args validation fails.
     * @throws {Error} If Prisma create fails.
     */
    async create(data: OutcomeWriteInput): Promise<OutcomeType> {
        try {
            const writeData = OutcomeWriteInputSchema.parse(data);
            const args = OutcomeCreateOneStrictSchema.parse({ data: writeData });
            return await prisma.outcome.create(args);
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Upserts an outcome by the `(gameDayId, playerId)` composite key.
     * @param data - Write payload keyed by `gameDayId` and `playerId`.
     * @returns The created or updated outcome row.
     * @throws {z.ZodError} If input or Prisma-args validation fails.
     * @throws {Error} If Prisma upsert fails.
     */
    async upsert(data: OutcomeWriteInput): Promise<OutcomeType> {
        try {
            const writeData = OutcomeWriteInputSchema.parse(data);
            const args = OutcomeUpsertOneStrictSchema.parse({
                where: {
                    gameDayId_playerId: {
                        gameDayId: writeData.gameDayId,
                        playerId: writeData.playerId,
                    },
                },
                create: writeData,
                update: writeData,
            });
            return await prisma.outcome.upsert(args);
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Deletes an outcome by its composite key.
     *
     * Not-found deletes (`P2025`) are treated as no-ops.
     *
     * @param gameDayId - The ID of the game day.
     * @param playerId - The ID of the player.
     * @returns Resolves when deletion handling completes.
     * @throws {z.ZodError} If key validation fails.
     * @throws {Error} If Prisma delete fails for reasons other than not-found.
     */
    async delete(gameDayId: number, playerId: number): Promise<void> {
        try {
            const where = OutcomeWhereUniqueInputObjectSchema.parse({
                gameDayId_playerId: {
                    gameDayId: gameDayId,
                    playerId: playerId,
                },
            });

            await prisma.outcome.delete({ where });
        } catch (error) {
            if (isPrismaNotFoundError(error)) {
                return;
            }
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Deletes all outcomes.
     * @returns A promise that resolves when all outcomes are deleted.
     * @throws An error if there is a failure.
     */
    async deleteAll(): Promise<void> {
        try {
            await prisma.outcome.deleteMany();
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }
}

const outcomeService = new OutcomeService();
export default outcomeService;
