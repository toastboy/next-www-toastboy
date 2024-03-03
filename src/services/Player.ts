import { Player } from '@prisma/client';
import prisma from 'lib/prisma';
import debug from 'debug';

const log = debug('footy:api');

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
        if (player.is_admin !== null && typeof player.is_admin !== 'boolean') {
            throw new Error(`Invalid is_admin value: ${player.is_admin}`);
        }
        if (player.login !== null && typeof player.login !== 'string') {
            throw new Error(`Invalid login value: ${player.login}`);
        }
        if (player.first_name !== null && typeof player.first_name !== 'string') {
            throw new Error(`Invalid first_name value: ${player.first_name}`);
        }
        if (player.last_name !== null && typeof player.last_name !== 'string') {
            throw new Error(`Invalid last_name value: ${player.last_name}`);
        }
        if (player.email !== null && typeof player.email !== 'string') {
            throw new Error(`Invalid email value: ${player.email}`);
        }
        if (player.joined !== null && !(player.joined instanceof Date)) {
            throw new Error(`Invalid joined value: ${player.joined}`);
        }
        if (player.finished !== null && !(player.finished instanceof Date)) {
            throw new Error(`Invalid finished value: ${player.finished}`);
        }
        if (player.born !== null && !(player.born instanceof Date)) {
            throw new Error(`Invalid born value: ${player.born}`);
        }
        if (player.introduced_by !== null && !Number.isInteger(player.introduced_by)) {
            throw new Error(`Invalid introduced_by value: ${player.introduced_by}`);
        }
        if (player.comment !== null && typeof player.comment !== 'string') {
            throw new Error(`Invalid comment value: ${player.comment}`);
        }
        if (player.anonymous !== null && typeof player.anonymous !== 'boolean') {
            throw new Error(`Invalid anonymous value: ${player.anonymous}`);
        }
        if (player.goalie !== null && typeof player.goalie !== 'boolean') {
            throw new Error(`Invalid goalie value: ${player.goalie}`);
        }

        return player;
    }

    /**
     * Get a single player by id
     * @param id The numeric ID for the player
     * @returns A promise that resolves to the player or undefined if none was
     * found
     */
    async getById(id: number): Promise<Player | undefined> {
        try {
            return prisma.player.findUnique({
                where: {
                    id: id
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
    async getByLogin(login: string): Promise<Player | undefined> {
        try {
            return prisma.player.findUnique({
                where: {
                    login: login
                },
            });
        } catch (error) {
            log(`Error fetching Player: ${error}`);
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
    async getLogin(idOrLogin: string): Promise<string | undefined> {
        try {
            if (!idOrLogin) {
                return undefined;
            }

            if (!isNaN(Number(idOrLogin))) {
                const player = await this.getById(Number(idOrLogin));
                return player?.login;
            } else {
                const player = await this.getByLogin(idOrLogin);
                return player?.login;
            }
        } catch (error) {
            log(`Error getting Player login: ${error}`);
            throw error;
        }
    }

    /**
     * Get all players matching the given criteria
     * @param active Only return active players
     * @returns A promise that resolves to all players
     */
    async getAll(active = true): Promise<Player[]> {
        try {
            return prisma.player.findMany({
                where: {
                    finished: active ? null : { not: null },
                },
            });
        } catch (error) {
            log(`Error fetching Players: ${error}`);
            throw error;
        }
    }

    /**
     * Return a map of all player ids and logins, so that either can be used to
     * refer to a given player
     * @returns A promise that resolves to a map containing all logins and ids
     * as keys and the player objects as values
     */
    async getAllIdsAndLogins(): Promise<Map<string, Player>> {
        try {
            const players = await prisma.player.findMany({});
            const map = new Map<string, Player>();

            players.forEach((player: Player) => {
                map.set(player.id.toString(), player);
                map.set(player.login, player);
            });

            return map;
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
    getName(player: Player | null): string | null {
        try {
            if (player == null) {
                return null;
            }

            if (player.anonymous) {
                return `Player ${player.id}`;
            }

            return `${player.first_name} ${player.last_name}`;
        } catch (error) {
            log(`Error fetching Player name: ${error}`);
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
                data: this.validate(data)
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
                update: data,
                create: data,
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
