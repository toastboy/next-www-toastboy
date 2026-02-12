import 'server-only';

import debug from 'debug';
import prisma from 'prisma/prisma';
import {
    PlayerLoginWhereUniqueInputObjectSchema,
    PlayerWhereUniqueInputObjectSchema,
} from 'prisma/zod/schemas';
import { PlayerType } from 'prisma/zod/schemas/models/Player.schema';
import { PlayerDataType, PlayerFormType } from 'types';

import { isPrismaNotFoundError } from '@/lib/prismaErrors';
import {
    PlayerCreateOneStrictSchema,
    type PlayerCreateWriteInput,
    PlayerCreateWriteInputSchema,
    PlayerUpdateOneStrictSchema,
    type PlayerUpdateWriteInput,
    PlayerUpdateWriteInputSchema,
} from '@/types/PlayerStrictSchema';

const log = debug('footy:api');

class PlayerService {
    /**
     * Get a single player by id
     * @param id The numeric ID for the player
     * @returns A promise that resolves to the player or undefined if none was
     * found
     */
    async getById(id: number) {
        try {
            const where = PlayerWhereUniqueInputObjectSchema.parse({ id });
            return prisma.player.findUnique({ where });
        } catch (error) {
            log(`Error fetching Player: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Get a single player by login
     * @param login The login name
     * @returns A promise that resolves to the player or undefined if none was
     * found
     */
    async getByLogin(login: string) {
        try {
            const where = PlayerLoginWhereUniqueInputObjectSchema.parse({ login });
            const playerLogin = await prisma.playerLogin.findUnique({
                where,
                include: {
                    player: true,
                },
            });

            return playerLogin?.player ?? null;
        } catch (error) {
            log(`Error fetching Player: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Get the player corresponding to the given string. If idOrLogin is a
     * string then we check whether a player with the given login exists. If
     * it's a number then we look up the player with that id.
     * @param idOrLogin A string which may contain a player id or a login
     * @returns A promise resolving to the player identified by idOrLogin if
     * such a player exists, or undefined otherwise.
     */
    async getByIdOrLogin(idOrLogin: string) {
        try {
            if (!isNaN(Number(idOrLogin))) {
                return await this.getById(Number(idOrLogin));
            } else {
                return await this.getByLogin(idOrLogin);
            }
        } catch (error) {
            log(`Error getting Player login: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Get the player login corresponding to the given string. If idOrLogin is a
     * string then we check whether a player with the given login exists. If it's a
     * number then we look up the player with that id.
     * @param idOrLogin A string which may contain a player id or a login
     * @returns A string containing the login of the player identified by idOrLogin
     * if such a player exists, or undefined otherwise.
     */
    async getLogin(idOrLogin: string) {
        try {
            if (!isNaN(Number(idOrLogin))) {
                const playerLogin = await prisma.playerLogin.findFirst({
                    where: {
                        playerId: Number(idOrLogin),
                    },
                    orderBy: {
                        login: 'asc',
                    },
                });
                return playerLogin ? playerLogin.login : null;
            }

            const where = PlayerLoginWhereUniqueInputObjectSchema.parse({ login: idOrLogin });
            const playerLogin = await prisma.playerLogin.findUnique({ where });
            return playerLogin ? playerLogin.login : null;
        } catch (error) {
            log(`Error getting Player login: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Retrieves the ID of a player based on the provided ID or login. If the
     * input is a valid number, it retrieves the player by ID. If the input is a
     * string, it retrieves the player by login.
     * @param idOrLogin - The ID or login of the player.
     * @returns A Promise that resolves to the player's ID if found, or null if
     * not found.
     * @throws If there is an error retrieving the player's ID.
     */
    async getId(idOrLogin: string) {
        try {
            if (!isNaN(Number(idOrLogin))) {
                const player = await this.getById(Number(idOrLogin));
                return player ? player.id : null;
            } else {
                const where = PlayerLoginWhereUniqueInputObjectSchema.parse({ login: idOrLogin });
                const playerLogin = await prisma.playerLogin.findUnique({ where });
                return playerLogin ? playerLogin.playerId : null;
            }
        } catch (error) {
            log(`Error getting Player id: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Retrieves all players from the database with their outcomes and extra
     * emails.
     *
     * @param active - Optional filter to only return active players (those
     * without a finished date). Defaults to undefined for all players.
     * @returns A promise that resolves to an array of PlayerDataType objects
     * enriched with computed statistics including:
     *          - accountEmail: The player's account email address
     *          - firstResponded: The earliest gameDayId where the player responded
     *          - lastResponded: The latest gameDayId where the player responded
     *          - firstPlayed: The earliest gameDayId where the player earned points
     *          - lastPlayed: The latest gameDayId where the player earned points
     *          - gamesPlayed: Total number of games with recorded points
     *          - gamesWon: Number of games where the player earned 3 points
     *          - gamesDrawn: Number of games where the player earned 1 point
     *          - gamesLost: Number of games where the player earned 0 points
     * @throws Logs and re-throws any errors that occur during the database
     * query
     */
    async getAll(options?: { activeOnly?: boolean }): Promise<PlayerDataType[]> {
        try {
            const players = await prisma.player.findMany({
                where: options?.activeOnly ? { finished: null } : undefined,
                include: {
                    outcomes: {
                        orderBy: {
                            gameDayId: 'desc',
                        },
                    },
                    extraEmails: {
                        orderBy: [
                            { verifiedAt: 'desc' },
                            { createdAt: 'desc' },
                        ],
                    },
                },
            });

            return players.map(({ outcomes, ...player }) => {
                const gamesResponded = outcomes.filter(outcome => outcome.response !== null);
                const gamesPlayed = outcomes.filter(outcome => outcome.points !== null);

                const respondedGameDays = gamesResponded.map(outcome => outcome.gameDayId);
                const playedGameDays = gamesPlayed.map(outcome => outcome.gameDayId);

                const accountEmail = (player as { accountEmail?: string | null }).accountEmail ?? null;

                return {
                    ...player,
                    accountEmail,
                    firstResponded: respondedGameDays.length > 0 ? Math.min(...respondedGameDays) : null,
                    lastResponded: respondedGameDays.length > 0 ? Math.max(...respondedGameDays) : null,
                    firstPlayed: playedGameDays.length > 0 ? Math.min(...playedGameDays) : null,
                    lastPlayed: playedGameDays.length > 0 ? Math.max(...playedGameDays) : null,
                    gamesPlayed: gamesPlayed.length,
                    gamesWon: gamesPlayed.filter(outcome => outcome.points === 3).length,
                    gamesDrawn: gamesPlayed.filter(outcome => outcome.points === 1).length,
                    gamesLost: gamesPlayed.filter(outcome => outcome.points === 0).length,
                } satisfies PlayerDataType;
            });
        } catch (error) {
            log(`Error fetching Players: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Retrieves all player IDs and logins from the database.
     *
     * @returns {Promise<string[]>} A promise that resolves to an array of strings containing player IDs and logins.
     * @throws Will throw an error if there is an issue fetching the player data.
     */
    async getAllIdsAndLogins() {
        try {
            const players = await prisma.player.findMany({
                select: {
                    id: true,
                    logins: {
                        select: {
                            login: true,
                        },
                        orderBy: {
                            login: 'asc',
                        },
                    },
                },
            });
            const idsAndLogins: string[] = [];

            players.forEach((player) => {
                idsAndLogins.push(player.id.toString());
                player.logins.forEach((login) => {
                    idsAndLogins.push(login.login);
                });
            });

            return idsAndLogins;
        } catch (error) {
            log(`Error fetching Player ids and logins: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Player name: allows for returning an anonymised name if desired,
     * otherwise concatenates the first name and the last name.
     * @param player The player object in question
     * @returns The player name string or null if there was an error
     */
    getName(player: PlayerType) {
        if (player.anonymous) {
            return `Player ${player.id}`;
        }

        return player.name ?? `Player ${player.id}`;
    }

    /**
     * Retrieves the form of a player for a given game day, based on their previous outcomes.
     * @param playerId - The ID of the player.
     * @param gameDayId - The ID of the game day to consider, or 0 for the latest.
     * @param history - The number of previous outcomes to consider.
     * @returns A promise that resolves to an array of outcomes with game days.
     */
    async getForm(
        playerId: number,
        gameDayId: number,
        history: number,
    ): Promise<PlayerFormType[]> {
        try {
            return prisma.outcome.findMany({
                where: {
                    gameDayId: gameDayId !== 0 ? { lt: gameDayId } : {},
                    playerId: playerId,
                    points: {
                        not: null,
                    },
                },
                orderBy: {
                    gameDayId: 'desc',
                },
                take: history,
                include: {
                    gameDay: true,
                },
            });
        } catch (error) {
            log(`Error fetching outcomes: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Retrieves the most recent outcome for a player, optionally filtered by year.
     *
     * @param playerId - The unique identifier of the player.
     * @param year - An optional year to limit the search range.
     * @returns A promise that resolves to the player's latest outcome including its game day, or `null` if none is found.
     * @throws Will propagate any errors encountered during the retrieval process.
     */
    async getLastPlayed(playerId: number, year?: number): Promise<PlayerFormType | null> {
        try {
            return prisma.outcome.findFirst({
                where: {
                    playerId: playerId,
                    points: {
                        not: null,
                    },
                    gameDay: {
                        date: {
                            gte: year ? new Date(year, 0, 1) : undefined,
                            lt: year ? new Date(year + 1, 0, 1) : undefined,
                        },
                    },
                },
                orderBy: {
                    gameDayId: 'desc',
                },
                include: {
                    gameDay: true,
                },
                take: 1,
            });
        } catch (error) {
            log(`Error fetching outcomes: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Retrieves all the years that the given player has participated in any
     * way. That could be just responding to an invitation, going to the pub, or
     * playing a game of course.
     * @returns A promise that resolves to an array of distinct years: this will
     * always include 0 for 'all time' if there's at least one active year.
     * @throws An error if there is a failure.
     */
    async getYearsActive(playerId: number): Promise<number[]> {
        try {
            const outcomes = await prisma.outcome.findMany({
                where: {
                    playerId: playerId,
                },
                include: {
                    gameDay: true,
                },
            });
            const years = outcomes.map(o => o.gameDay.date.getFullYear());
            const distinctYears = Array.from(new Set(years));
            if (distinctYears.length) {
                distinctYears.push(0);
            }

            return Promise.resolve(distinctYears);
        } catch (error) {
            log(`Error fetching player active years: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Creates a player from validated write input.
     * @param data - Player write payload.
     * @returns The created player row.
     * @throws {z.ZodError} If input or Prisma-args validation fails.
     * @throws {Error} If Prisma create fails.
     */
    async create(data: PlayerCreateWriteInput): Promise<PlayerType> {
        try {
            const writeData = PlayerCreateWriteInputSchema.parse(data);
            const args = PlayerCreateOneStrictSchema.parse({ data: writeData });
            return await prisma.player.create(args);
        } catch (error) {
            log(`Error creating Player: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Updates an existing player by id from validated write input.
     * @param data - Player write payload including `id` and update fields.
     * @returns The updated player row.
     * @throws {z.ZodError} If input or Prisma-args validation fails.
     * @throws {Error} If Prisma update fails.
     */
    async update(data: PlayerUpdateWriteInput): Promise<PlayerType> {
        try {
            const { id, ...updateData } = PlayerUpdateWriteInputSchema.parse(data);
            const args = PlayerUpdateOneStrictSchema.parse({
                where: { id },
                data: updateData,
            });
            return await prisma.player.update(args);
        } catch (error) {
            log(`Error updating Player: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Anonymises a player record by its unique identifier.
     *
     * This validates the provided id, then updates the player to mark them as
     * anonymous, clears identifying fields (name and accountEmail), and sets
     * the finished timestamp to now.
     *
     * @param id - The unique identifier of the player to anonymise.
     * @returns A Promise that resolves to the updated PlayerType.
     * @throws {ZodError} If the id fails schema validation via
     * PlayerWhereUniqueInputObjectSchema.
     * @throws {Error} If the database update operation fails (e.g. Prisma
     * errors).
     */
    async anonymise(id: number): Promise<PlayerType> {
        try {
            const where = PlayerWhereUniqueInputObjectSchema.parse({ id });
            const data = {
                anonymous: true,
                name: null,
                accountEmail: null,
                finished: new Date(),
            };

            return await prisma.player.update({ where, data });
        } catch (error) {
            log(`Error anonymising Player: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Set or clear the finished timestamp for a player.
     *
     * @param playerId - The unique identifier of the player to update.
     * @param finished - If true (default), sets the `finished` field to the
     * current date/time; if false, clears the `finished` field (sets it to
     * null).
     * @returns A Promise that resolves to the updated PlayerType.
     * @throws Will throw if input validation or the database update fails.
     */
    async setFinished(playerId: number, finished = true): Promise<PlayerType> {
        try {
            const where = PlayerWhereUniqueInputObjectSchema.parse({ id: playerId });
            const data = {
                finished: finished ? new Date() : null,
            };

            return await prisma.player.update({ where, data });
        } catch (error) {
            log(`Error setting finished for Player: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Deletes a player by id.
     *
     * Not-found deletes (`P2025`) are treated as no-ops.
     *
     * @param id - The player id.
     * @returns Resolves when deletion handling completes.
     * @throws {z.ZodError} If id validation fails.
     * @throws {Error} If Prisma delete fails for reasons other than not-found.
     */
    async delete(id: number): Promise<void> {
        try {
            const where = PlayerWhereUniqueInputObjectSchema.parse({ id });
            await prisma.player.delete({ where });
        } catch (error) {
            if (isPrismaNotFoundError(error)) {
                return;
            }
            log(`Error deleting Player: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Deletes all players.
     * @returns Resolves when bulk deletion completes.
     * @throws {Error} If Prisma deleteMany fails.
     */
    async deleteAll(): Promise<void> {
        try {
            await prisma.player.deleteMany();
        } catch (error) {
            log(`Error deleting Players: ${String(error)}`);
            throw error;
        }
    }
}

const playerService = new PlayerService();
export default playerService;
