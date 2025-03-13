import { PlayerResponse } from '@prisma/client';
import debug from 'debug';
import prisma from 'lib/prisma';
import { Outcome, Turnout, TurnoutByYear, WDL } from 'lib/types';
import gameDayService from 'services/GameDay';

const log = debug('footy:api');

export class OutcomeService {
    /**
     * Validate an outcome
     * @param outcome The outcome to validate
     * @returns the validated outcome
     * @throws An error if the outcome is invalid.
     */
    validate(outcome: Outcome): Outcome {
        if (outcome.response && !Object.values(PlayerResponse).includes(outcome.response)) {
            throw new Error(`Invalid response value: ${outcome.response}`);
        }
        if (outcome.responseInterval && outcome.responseInterval < 0) {
            throw new Error(`Invalid responseInterval value: ${outcome.responseInterval}`);
        }
        if (outcome.points && (!Number.isInteger(outcome.points) || (outcome.points != 0 && outcome.points != 1 && outcome.points != 3))) {
            throw new Error(`Invalid points value: ${outcome.points}`);
        }
        if (outcome.team && !['A', 'B'].includes(outcome.team)) {
            throw new Error(`Invalid team value: ${outcome.team}`);
        }
        if (!outcome.gameDayId || !Number.isInteger(outcome.gameDayId) || outcome.gameDayId < 0) {
            throw new Error(`Invalid gameDay value: ${outcome.gameDayId}`);
        }
        if (!outcome.playerId || !Number.isInteger(outcome.playerId) || outcome.playerId < 0) {
            throw new Error(`Invalid player value: ${outcome.playerId}`);
        }

        return outcome;
    }

    /**
     * Retrieves an Outcome for the given Player ID for the given GameDay ID.
     * @param gameDayId - The ID of the GameDay.
     * @param playerId - The ID of the Player.
     * @returns A promise that resolves to the Outcome if found, otherwise null.
     * @throws An error if there is a failure.
     */
    async get(gameDayId: number, playerId: number): Promise<Outcome | null> {
        try {
            return prisma.outcome.findUnique({
                where: {
                    gameDayId_playerId: {
                        gameDayId: gameDayId,
                        playerId: playerId,
                    },
                },
            });
        } catch (error) {
            log(`Error fetching outcomes: ${error}`);
            throw error;
        }
    }

    /**
     * Retrieves all outcomes.
     * @returns A promise that resolves to an array of outcomes or null if an error occurs.
     * @throws An error if there is a failure.
     */
    async getAll(): Promise<Outcome[] | null> {
        try {
            return prisma.outcome.findMany({});
        } catch (error) {
            log(`Error fetching outcomes: ${error}`);
            throw error;
        }
    }

    /**
     * Retrieves the last played outcome.
     * @returns A Promise that resolves to the last played Outcome, or null if no outcome is found.
     * @throws An error if there is a failure.
     */
    async getLastPlayed(): Promise<Outcome | null> {
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
            log(`Error fetching outcome: ${error}`);
            throw error;
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
    async getAllForYear(year: number, untilGameDay?: number): Promise<Outcome[]> {
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
            log(`Error fetching outcomes: ${error}`);
            throw error;
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
            log(`Error fetching outcomes: ${error}`);
            throw error;
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
                const gameDayResponseCounts = Object.values(PlayerResponse).reduce((map, response) => {
                    const count = responseCounts
                        .filter((res) =>
                            gameDay && res.gameDayId === gameDay.id &&
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
                            .filter((rc) => rc.gameDayId === gameDay.id && rc.response === PlayerResponse.Yes)
                            .map((rc) => rc._count.team)[0] || 0,
                        cancelled: gameDay.mailSent !== null && !gameDay.game,
                    };
                }
            });

            return result as Turnout[];
        }
        catch (error) {
            log(`Error fetching outcomes: ${error}`);
            throw error;
        }
    }

    /**
     * Retrieves the turnout data by year.
     * @returns A promise that resolves to an array of `TurnoutByYear` objects.
     * @throws If there is an error fetching the outcomes.
     */
    async getTurnoutByYear(): Promise<TurnoutByYear[]> {
        try {
            const turnout = await this.getTurnout();
            const gameYears = await gameDayService.getAllYears();

            return Promise.resolve(gameYears.map((gameYear) => {
                const yearTurnout = turnout.filter((t) => gameYear === t.year);
                const result: TurnoutByYear = {
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
            log(`Error fetching outcomes: ${error}`);
            throw error;
        }
    }

    /**
     * Retrieves outcomes by game day ID and, optionally, team.
     * @param gameDayId - The ID of the game day.
     * @param team - Optional team ('A' or 'B').
     * @returns A promise that resolves to an array of Outcome objects.
     * @throws If there is an error fetching the outcomes.
     */
    async getByGameDay(gameDayId: number, team?: 'A' | 'B'): Promise<Outcome[]> {
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
            log(`Error fetching outcomes by GameDay: ${error}`);
            throw error;
        }
    }

    /**
     * Retrieves outcomes by player ID.
     * @param playerId - The ID of the player.
     * @returns A promise that resolves to an array of outcomes.
     * @throws An error if there is a failure.
     */
    async getByPlayer(playerId: number): Promise<Outcome[]> {
        try {
            return prisma.outcome.findMany({
                where: {
                    playerId: playerId,
                },
            });
        } catch (error) {
            log(`Error fetching outcomes by player: ${error}`);
            throw error;
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
            log(`Error fetching outcomes by player: ${error}`);
            throw error;
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
            log(`Error fetching latest game played by year: ${error}`);
            throw error;
        }
    }

    /**
     * Retrieves the win-draw-loss (WDL) statistics for team 'A' based on the bibs each game.
     *
     * @param {Object} params - The parameters for the query.
     * @param {number} [params.year] - The specific year to filter the game days. If not provided, all years are considered.
     * @returns {Promise<WDL>} A promise that resolves to an object containing the counts of games won, drawn, and lost.
     * @throws Will throw an error if there is an issue fetching the WDL counts.
     */
    async getByBibs({ year }: { year?: number }): Promise<WDL> {
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
            log(`Error fetching bibs WDL counts: ${error}`);
            throw error;
        }
    }

    /**
     * Creates a new outcome.
     * @param data The data for the new outcome.
     * @returns A promise that resolves to the created outcome, or null if an error occurs.
     * @throws An error if there is a failure.
     */
    async create(data: Outcome): Promise<Outcome | null> {
        try {
            return await prisma.outcome.create({
                data: this.validate(data),
            });
        } catch (error) {
            log(`Error creating outcome: ${error}`);
            throw error;
        }
    }

    /**
     * Upserts an Outcome.
     * @param data The data to be upserted.
     * @returns A promise that resolves to the upserted Outcome, or null if the upsert failed.
     * @throws An error if there is a failure.
     */
    async upsert(data: Outcome): Promise<Outcome | null> {
        try {
            return await prisma.outcome.upsert({
                where: {
                    gameDayId_playerId: {
                        gameDayId: data.gameDayId,
                        playerId: data.playerId,
                    },
                },
                update: this.validate(data),
                create: this.validate(data),
            });
        } catch (error) {
            log(`Error upserting Outcome: ${error}`);
            throw error;
        }
    }

    /**
     * Deletes an Outcome.
     * @param gameDayId - The ID of the GameDay.
     * @param playerId - The ID of the Player.
     * @returns A Promise that resolves to void.
     * @throws An error if there is a failure.
     */
    async delete(gameDayId: number, playerId: number): Promise<void> {
        try {
            await prisma.outcome.delete({
                where: {
                    gameDayId_playerId: {
                        gameDayId: gameDayId,
                        playerId: playerId,
                    },
                },
            });
        } catch (error) {
            log(`Error deleting outcome: ${error}`);
            throw error;
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
            log(`Error deleting outcomes: ${error}`);
            throw error;
        }
    }
}

const outcomeService = new OutcomeService();
export default outcomeService;
