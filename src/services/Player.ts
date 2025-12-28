import 'server-only';

import debug from 'debug';
import prisma from 'prisma/prisma';
import {
    PlayerEmailUncheckedCreateInputObjectZodSchema,
    PlayerEmailUncheckedUpdateInputObjectZodSchema,
    PlayerEmailWhereUniqueInputObjectSchema,
    PlayerInvitationUncheckedCreateInputObjectZodSchema,
    PlayerInvitationUncheckedUpdateInputObjectZodSchema,
    PlayerInvitationWhereUniqueInputObjectSchema,
    PlayerUncheckedCreateInputObjectZodSchema,
    PlayerUncheckedUpdateInputObjectZodSchema,
    PlayerWhereUniqueInputObjectSchema,
} from 'prisma/zod/schemas';
import {
    PlayerSchema,
    PlayerType,
} from 'prisma/zod/schemas/models/Player.schema';
import { PlayerEmailType } from 'prisma/zod/schemas/models/PlayerEmail.schema';
import { PlayerInvitationType } from 'prisma/zod/schemas/models/PlayerInvitation.schema';
import { PlayerDataType, PlayerFormType } from 'types';
import z from 'zod';

/** Field definitions with extra validation */
const extendedFields = {
    id: z.number().int().min(1).optional(),
};

const PlayerLoginWhereUniqueInputSchema = z.object({
    login: z.string().max(16),
});

const PlayerEmailExtendedFields = {
    playerId: z.number().int().min(1),
    email: z.email(),
    verifiedAt: z.date().nullish().optional(),
};

const PlayerEmailExtendedFieldsForUpdate = {
    playerId: z.number().int().min(1).optional(),
    email: z.email().optional(),
    verifiedAt: z.date().nullish().optional(),
};

const PlayerInvitationExtendedFields = {
    playerId: z.number().int().min(1),
    email: z.email(),
    tokenHash: z.string().length(64),
    expiresAt: z.date(),
    usedAt: z.date().nullish().optional(),
};

const PlayerInvitationExtendedFieldsForUpdate = {
    playerId: z.number().int().min(1).optional(),
    email: z.email().optional(),
    tokenHash: z.string().length(64).optional(),
    expiresAt: z.date().optional(),
    usedAt: z.date().nullish().optional(),
};

/** Schemas for enforcing strict input */
export const PlayerUncheckedCreateInputObjectStrictSchema =
    PlayerUncheckedCreateInputObjectZodSchema.extend({
        ...extendedFields,
    });
export const PlayerUncheckedUpdateInputObjectStrictSchema =
    PlayerUncheckedUpdateInputObjectZodSchema.extend({
        ...extendedFields,
    });
export const PlayerEmailUncheckedCreateInputObjectStrictSchema =
    PlayerEmailUncheckedCreateInputObjectZodSchema.extend({
        ...PlayerEmailExtendedFields,
    });
export const PlayerEmailUncheckedUpdateInputObjectStrictSchema =
    PlayerEmailUncheckedUpdateInputObjectZodSchema.extend({
        ...PlayerEmailExtendedFieldsForUpdate,
    });
export const PlayerInvitationUncheckedCreateInputObjectStrictSchema =
    PlayerInvitationUncheckedCreateInputObjectZodSchema.extend({
        ...PlayerInvitationExtendedFields,
    });
export const PlayerInvitationUncheckedUpdateInputObjectStrictSchema =
    PlayerInvitationUncheckedUpdateInputObjectZodSchema.extend({
        ...PlayerInvitationExtendedFieldsForUpdate,
    });

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
            const where = PlayerLoginWhereUniqueInputSchema.parse({ login });
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

            const where = PlayerLoginWhereUniqueInputSchema.parse({ login: idOrLogin });
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
                const where = PlayerLoginWhereUniqueInputSchema.parse({ login: idOrLogin });
                const playerLogin = await prisma.playerLogin.findUnique({ where });
                return playerLogin ? playerLogin.playerId : null;
            }
        } catch (error) {
            log(`Error getting Player id: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Retrieves the player ID associated with the given email address. It's not
     * enough to just have a record with that email; the email must also be
     * verified.
     *
     * @param email - The email address of the player.
     * @returns A promise that resolves to the player ID if found, or null if no
     * player is found with the given email.
     * @throws Will throw an error if there is an issue with the database query.
     */
    async getIdByEmail(email: string) {
        try {
            const playerEmail = await prisma.playerEmail.findFirst({
                where: {
                    email,
                    verifiedAt: {
                        not: null,
                    },
                },
            });

            return playerEmail?.playerId ?? null;
        } catch (error) {
            log(`Error getting Player id: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Creates a player email record.
     * @param rawData The properties to add to the player email
     * @returns A promise that resolves to the newly-created player email
     */
    async createPlayerEmail(rawData: unknown): Promise<PlayerEmailType> {
        try {
            const data = PlayerEmailUncheckedCreateInputObjectStrictSchema.parse(rawData);
            return await prisma.playerEmail.create({ data });
        } catch (error) {
            log(`Error creating PlayerEmail: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Retrieves a player email record by its email address.
     * @param email The email address to look up
     * @returns A promise that resolves to the player email or null if not found
     */
    async getPlayerEmailByEmail(email: string): Promise<PlayerEmailType | null> {
        try {
            const where = PlayerEmailWhereUniqueInputObjectSchema.parse({ email });
            return await prisma.playerEmail.findUnique({ where });
        } catch (error) {
            log(`Error fetching PlayerEmail: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Upserts a verified player email record for the given player.
     * @param playerId The player ID to associate
     * @param email The email address to upsert
     * @param verifiedAt The verification timestamp
     * @returns A promise that resolves to the upserted player email
     */
    async upsertVerifiedPlayerEmail(playerId: number, email: string, verifiedAt: Date): Promise<PlayerEmailType> {
        try {
            const where = PlayerEmailWhereUniqueInputObjectSchema.parse({ email });
            const create = PlayerEmailUncheckedCreateInputObjectStrictSchema.parse({
                playerId,
                email,
                verifiedAt,
            });
            const update = PlayerEmailUncheckedUpdateInputObjectStrictSchema.parse({
                playerId,
                verifiedAt,
            });

            return await prisma.playerEmail.upsert({ where, update, create });
        } catch (error) {
            log(`Error upserting PlayerEmail: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Creates a player invitation record.
     * @param rawData The properties to add to the player invitation
     * @returns A promise that resolves to the newly-created player invitation
     */
    async createPlayerInvitation(rawData: unknown): Promise<PlayerInvitationType> {
        try {
            const data = PlayerInvitationUncheckedCreateInputObjectStrictSchema.parse(rawData);
            return await prisma.playerInvitation.create({ data });
        } catch (error) {
            log(`Error creating PlayerInvitation: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Retrieves a player invitation by its token hash.
     * @param tokenHash The token hash for the invitation
     * @returns A promise that resolves to the player invitation or null if not found
     */
    async getPlayerInvitationByTokenHash(tokenHash: string): Promise<PlayerInvitationType | null> {
        try {
            const where = PlayerInvitationWhereUniqueInputObjectSchema.parse({ tokenHash });
            return await prisma.playerInvitation.findUnique({ where });
        } catch (error) {
            log(`Error fetching PlayerInvitation: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Marks a player invitation as used.
     * @param id The invitation ID to update
     * @param usedAt The timestamp to set
     * @returns A promise that resolves to the updated invitation
     */
    async markPlayerInvitationUsed(id: number, usedAt: Date): Promise<PlayerInvitationType> {
        try {
            const where = PlayerInvitationWhereUniqueInputObjectSchema.parse({ id });
            const data = PlayerInvitationUncheckedUpdateInputObjectStrictSchema.parse({ usedAt });
            return await prisma.playerInvitation.update({ where, data });
        } catch (error) {
            log(`Error updating PlayerInvitation: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Get all players with the game day number when they last played
     * @returns A promise that resolves to all players with their last game day number
     */
    async getAll(): Promise<PlayerDataType[]> {
        try {
            const players = await prisma.player.findMany({
                include: {
                    outcomes: {
                        orderBy: {
                            gameDayId: 'desc',
                        },
                    },
                    emails: {
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

                return {
                    ...player,
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
     * Retrieves all player emails from the database.
     * @param playerId - Optional player ID to filter emails for a specific player. If not provided, retrieves all player emails.
     * @returns A promise that resolves to an array of objects containing the player ID and associated email address.
     * @throws Will throw an error if the database query fails.
     */
    async getAllEmails(playerId?: number) {
        try {
            return await prisma.playerEmail.findMany({
                where: playerId ? { playerId } : undefined,
            });
        } catch (error) {
            log(`Error fetching Player emails: ${String(error)}`);
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
     * Creates a player
     * @param data The properties to add to the player
     * @returns A promise that resolves to the newly-created player
     */
    async create(rawData: unknown): Promise<PlayerType> {
        try {
            const data = PlayerUncheckedCreateInputObjectStrictSchema.parse(rawData);

            return await prisma.player.create({ data });
        } catch (error) {
            log(`Error creating Player: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Updates a player if it exists, or creates it if not
     * @param data The properties to add to the player
     * @returns A promise that resolves to the updated or created player
     */
    async upsert(rawData: unknown): Promise<PlayerType> {
        try {
            const parsed = PlayerSchema.pick({ id: true }).parse(rawData);
            const where = PlayerWhereUniqueInputObjectSchema.parse({ id: parsed.id });
            const update = PlayerUncheckedUpdateInputObjectStrictSchema.parse(rawData);
            const create = PlayerUncheckedCreateInputObjectStrictSchema.parse(rawData);

            console.error('Player upsert args', {
                where,
                update,
                create,
                rawDataType: typeof rawData,
            });

            return await prisma.player.upsert({ where, update, create });
        } catch (error) {
            const err = error as {
                meta?: { argumentPath?: string[] };
                message?: string;
            };
            console.error('Player upsert error meta', {
                message: err?.message,
                argumentPath: err?.meta?.argumentPath,
                meta: err?.meta,
            });
            log(`Error upserting Player: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Deletes a player. If no such player exists, that's not an error.
     * @param id The ID of the player to delete
     * @returns A promise that resolves to the deleted player if there was one, or
     * undefined otherwise
     */
    async delete(id: number) {
        try {
            return await prisma.player.delete({
                where: {
                    id: id,
                },
            });
        } catch (error) {
            log(`Error deleting Player: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Deletes all players
     */
    async deleteAll() {
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
