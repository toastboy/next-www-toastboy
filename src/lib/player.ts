import { player } from '@prisma/client';
import prisma from 'lib/prisma';

type PlayerData = {
    id: number;
    is_admin?: number;
    login?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    joined?: Date;
    finished?: Date;
    born?: Date;
    introduced_by?: number;
    comment?: string;
    anonymous?: number;
    goalie?: number;
    mugshot?: string;
};

class PlayerService {
    /**
     * Get a single player by id
     * @param id The numeric ID for the player
     * @returns A promise that resolves to the player or undefined if none was
     * found
     */
    async getById(id: number): Promise<player | undefined> {
        return prisma.player.findUnique({
            where: {
                id: id
            },
        });
    }

    /**
     * Get a single player by login
     * @param login The login name
     * @returns A promise that resolves to the player or undefined if none was
     * found
     */
    async getByLogin(login: string): Promise<player | undefined> {
        return prisma.player.findUnique({
            where: {
                login: login
            },
        });
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
        if (idOrLogin == undefined ||
            idOrLogin == "") {
            return undefined;
        }
        else if (!isNaN(Number(idOrLogin))) {
            const player = await this.getById(Number(idOrLogin));
            return player ? player.login : undefined;
        }
        else {
            const player = await this.getByLogin(idOrLogin);
            return player ? player.login : undefined;
        }

        return undefined;
    }

    /**
     * Get all players matching the given criteria
     * @param active Only return active players
     * @returns A promise that resolves to all players
     */
    async getAll(active = true): Promise<player[]> {
        if (active) {
            return await prisma.player.findMany({
                where: {
                    finished: {
                        equals: null,
                    },
                },
            });
        }
        else {
            return await prisma.player.findMany({});
        }
    }

    /**
     * Return a list of all player ids and logins, so that either can be used to
     * refer to a given player
     * @returns A map containing all logins and ids
     */
    async getAllIdsAndLogins() {
        const data = await prisma.player.findMany({});

        const ids = data.map((player: player) => ({
            idOrLogin: player.id.toString(),
        }));
        const logins = data.map((player: player) => ({
            idOrLogin: player.login,
        }));

        return new Map([...Array.from(ids.entries()), ...Array.from(logins.entries())]);
    }

    /**
     * Player name: allows for returning "Anonymous" if desired, otherwise
     * concatenates the first name and the last name.
     * @param player The player model object in question
     * @returns The player name string or null if there was an error
     */

    getName(player: player) {
        if (player == null || player == undefined) {
            return null;
        }

        if (player.anonymous) {
            return "Player " + player.id.toString();
        }

        return player.first_name + " " + player.last_name;
    }

    /**
     * Creates a player
     * @param data The properties to add to the player
     * @returns A promise that resolves to the newly-created player
     */
    async create(data: PlayerData): Promise<player> {
        return await prisma.player.create({
            data: data
        });
    }

    /**
     * Updates a player if it exists, or creates it if not
     * @param data The properties to add to the player
     * @returns A promise that resolves to the updated or created player
     */
    async upsert(data: PlayerData): Promise<player> {
        return await prisma.player.upsert({
            where: { id: data.id },
            update: data,
            create: data,
        });
    }

    /**
     * Deletes a player. If no such player exists, that's not an error.
     * @param id The ID of the player to delete
     * @returns A promise that resolves to the deleted player if there was one, or
     * undefined otherwise
     */
    async delete(id: number): Promise<player | undefined> {
        return await prisma.player.delete({
            where: {
                id: id,
            },
        });
    }

    /**
     * Deletes all players
     */
    async deleteAll(): Promise<void> {
        await prisma.player.deleteMany();
    }
}

export const playerService = new PlayerService();
