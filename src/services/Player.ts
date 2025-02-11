import { Outcome, Player } from '@prisma/client';
import debug from 'debug';
import prisma from 'lib/prisma';

const log = debug('footy:api');

interface PlayerData extends Player {
    firstResponded: number | null;
    lastResponded: number | null;
    firstPlayed: number | null;
    lastPlayed: number | null;
    gamesPlayed: number;
    gamesWon: number;
    gamesDrawn: number;
    gamesLost: number;
}

class PlayerService {
    /**
     * Validate a Player
     * @param player The Player to validate
     * @returns the validated Player
     * @throws An error if the Player is invalid.
     */
    validate(player: Player): Player {
        if (!player.id || !Number.isInteger(player.id) || player.id < 0) {
            throw new Error(`Invalid id value: ${player.id}`);
        }

        return player;
    }

    /**
     * Get a single player by id
     * @param id The numeric ID for the player
     * @returns A promise that resolves to the player or undefined if none was
     * found
     */
    async getById(id: number): Promise<Player | null> {
        try {
            return prisma.player.findUnique({
                where: {
                    id: id,
                },
            });
        } catch (error) {
            log(`Error fetching Player: ${error}`);
            throw error;
        }
    }

    /**
     * Get a single player by login
     * @param login The login name
     * @returns A promise that resolves to the player or undefined if none was
     * found
     */
    async getByLogin(login: string): Promise<Player | null> {
        try {
            return prisma.player.findUnique({
                where: {
                    login: login,
                },
            });
        } catch (error) {
            log(`Error fetching Player: ${error}`);
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
    async getByIdOrLogin(idOrLogin: string): Promise<Player | null> {
        try {
            if (!isNaN(Number(idOrLogin))) {
                return await this.getById(Number(idOrLogin));
            } else {
                return await this.getByLogin(idOrLogin);
            }
        } catch (error) {
            log(`Error getting Player login: ${error}`);
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
    async getLogin(idOrLogin: string): Promise<string | null> {
        try {
            const player = await this.getByIdOrLogin(idOrLogin);
            return player ? player.login : null;
        } catch (error) {
            log(`Error getting Player login: ${error}`);
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
    async getId(idOrLogin: string): Promise<number | null> {
        try {
            if (!isNaN(Number(idOrLogin))) {
                const player = await this.getById(Number(idOrLogin));
                return player ? player.id : null;
            } else {
                const player = await this.getByLogin(idOrLogin);
                return player ? player.id : null;
            }
        } catch (error) {
            log(`Error getting Player id: ${error}`);
            throw error;
        }
    }

    /**
     * Get all players with the game day number when they last played
     * @returns A promise that resolves to all players with their last game day number
     */
    async getAll(): Promise<PlayerData[]> {
        try {
            const players = await prisma.player.findMany({
                include: {
                    outcomes: {
                        orderBy: {
                            gameDayId: 'desc',
                        },
                    },
                },
            });

            return players.map(({ outcomes, ...player }) => {
                const gamesResponded = outcomes.filter(outcome => outcome.response !== null);
                const gamesPlayed = outcomes.filter(outcome => outcome.points !== null);

                return {
                    ...player,
                    firstResponded: Math.min(...gamesResponded.map(outcome => outcome.gameDayId)),
                    lastResponded: Math.max(...gamesResponded.map(outcome => outcome.gameDayId)),
                    firstPlayed: Math.min(...gamesPlayed.map(outcome => outcome.gameDayId)),
                    lastPlayed: Math.max(...gamesPlayed.map(outcome => outcome.gameDayId)),
                    gamesPlayed: gamesPlayed.length,
                    gamesWon: gamesPlayed.filter(outcome => outcome.points === 3).length,
                    gamesDrawn: gamesPlayed.filter(outcome => outcome.points === 1).length,
                    gamesLost: gamesPlayed.filter(outcome => outcome.points === 0).length,
                };
            });
        } catch (error) {
            log(`Error fetching Players: ${error}`);
            throw error;
        }
    }

    /**
     * Retrieves all player IDs and logins from the database.
     *
     * @returns {Promise<string[]>} A promise that resolves to an array of strings containing player IDs and logins.
     * @throws Will throw an error if there is an issue fetching the player data.
     */
    async getAllIdsAndLogins(): Promise<string[]> {
        try {
            const players = await prisma.player.findMany({});
            const idsAndLogins: string[] = [];

            players.forEach((player: Player) => {
                idsAndLogins.push(player.id.toString());
                idsAndLogins.push(player.login);
            });

            return idsAndLogins;
        } catch (error) {
            log(`Error fetching Player ids and logins: ${error}`);
            throw error;
        }
    }

    /**
     * Player name: allows for returning an anonymised name if desired,
     * otherwise concatenates the first name and the last name.
     * @param player The player object in question
     * @returns The player name string or null if there was an error
     */
    getName(player: Player): string | null {
        if (player.anonymous) {
            return `Player ${player.id}`;
        }

        return `${player.firstName} ${player.lastName}`;
    }

    /**
     * Retrieves the form of a player for a given game day, based on their previous outcomes.
     * @param playerId - The ID of the player.
     * @param gameDayId - The ID of the game day.
     * @param history - The number of previous outcomes to consider.
     * @returns A promise that resolves to an array of outcomes.
     */
    async getForm(playerId: number, gameDayId: number, history: number): Promise<Outcome[] | null> {
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
            });
        } catch (error) {
            log(`Error fetching outcomes: ${error}`);
            throw error;
        }
    }

    /**
     * Retrieves the last played game outcome for a given player.
     * @param playerId - The ID of the player.
     * @returns A promise that resolves to an array of outcomes or null.
     */
    async getLastPlayed(playerId: number): Promise<Outcome | null> {
        try {
            return prisma.outcome.findFirst({
                where: {
                    playerId: playerId,
                    points: {
                        not: null,
                    },
                },
                orderBy: {
                    gameDayId: 'desc',
                },
                take: 1,
            });
        } catch (error) {
            log(`Error fetching outcomes: ${error}`);
            throw error;
        }
    }

    /**
     * Retrieves all the years that the given player has participated in any
     * way. That could be just responding to an invitation, going to the pub, or
     * playing a game of course.
     * @returns A promise that resolves to an array of distinct years or null if
     * there are none.
     * @throws An error if there is a failure.
     */
    async getYearsActive(playerId: number): Promise<number[] | null> {
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
            log(`Error fetching player active years: ${error}`);
            throw error;
        }
    }

    /**
     * Creates a player
     * @param data The properties to add to the player
     * @returns A promise that resolves to the newly-created player
     */
    async create(data: Player): Promise<Player> {
        try {
            return await prisma.player.create({
                data: this.validate(data),
            });
        } catch (error) {
            log(`Error creating Player: ${error}`);
            throw error;
        }
    }

    /**
     * Updates a player if it exists, or creates it if not
     * @param data The properties to add to the player
     * @returns A promise that resolves to the updated or created player
     */
    async upsert(data: Player): Promise<Player> {
        try {
            return await prisma.player.upsert({
                where: { id: data.id },
                update: this.validate(data),
                create: this.validate(data),
            });
        } catch (error) {
            log(`Error upserting Player: ${error}`);
            throw error;
        }
    }

    /**
     * Deletes a player. If no such player exists, that's not an error.
     * @param id The ID of the player to delete
     * @returns A promise that resolves to the deleted player if there was one, or
     * undefined otherwise
     */
    async delete(id: number): Promise<Player | undefined> {
        try {
            return await prisma.player.delete({
                where: {
                    id: id,
                },
            });
        } catch (error) {
            log(`Error deleting Player: ${error}`);
            throw error;
        }
    }

    /**
     * Deletes all players
     */
    async deleteAll(): Promise<void> {
        try {
            await prisma.player.deleteMany();
        } catch (error) {
            log(`Error deleting Players: ${error}`);
            throw error;
        }
    }
}

const playerService = new PlayerService();
export default playerService;
