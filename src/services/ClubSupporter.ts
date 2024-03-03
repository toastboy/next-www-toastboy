import { ClubSupporter } from '@prisma/client';
import prisma from 'lib/prisma';
import debug from 'debug';

const log = debug('footy:api');

export class ClubSupporterService {
    /**
     * Validate a ClubSupporter
     * @param clubSupporter The ClubSupporter to validate
     * @returns the validated ClubSupporter
     * @throws An error if the ClubSupporter is invalid.
     */
    validate(clubSupporter: ClubSupporter): ClubSupporter {
        if (!clubSupporter.playerId || !Number.isInteger(clubSupporter.playerId) || clubSupporter.playerId < 0) {
            throw new Error(`Invalid playerId value: ${clubSupporter.playerId}`);
        }
        if (!clubSupporter.clubId || !Number.isInteger(clubSupporter.clubId) || clubSupporter.clubId < 0) {
            throw new Error(`Invalid clubId value: ${clubSupporter.clubId}`);
        }

        return clubSupporter;
    }

    /**
     * Retrieves a ClubSupporter for the given player ID and club ID.
     * @param playerId - The ID of the player.
     * @param clubId - The ID of the club.
     * @returns A promise that resolves to the ClubSupporter if found, otherwise null.
     * @throws An error if there is a failure.
     */
    async get(playerId: number, clubId: number): Promise<ClubSupporter | null> {
        try {
            return prisma.clubSupporter.findUnique({
                where: {
                    playerId_clubId: {
                        playerId: playerId,
                        clubId: clubId
                    }
                },
            });
        } catch (error) {
            log(`Error fetching ClubSupporter: ${error}`);
            throw error;
        }
    }

    /**
     * Retrieves all ClubSupporters.
     * @returns A promise that resolves to an array of ClubSupporters or null if an error occurs.
     * @throws An error if there is a failure.
     */
    async getAll(): Promise<ClubSupporter[] | null> {
        try {
            return prisma.clubSupporter.findMany({});
        } catch (error) {
            log(`Error fetching ClubSupporters: ${error}`);
            throw error;
        }
    }

    /**
     * Retrieves ClubSupporters by player ID.
     * @param playerId - The ID of the player.
     * @returns A promise that resolves to an array of ClubSupporters or null.
     * @throws An error if there is a failure.
     */
    async getByPlayer(playerId: number): Promise<ClubSupporter[] | null> {
        try {
            return prisma.clubSupporter.findMany({
                where: {
                    playerId: playerId
                },
            });
        } catch (error) {
            log(`Error fetching ClubSupporters by player: ${error}`);
            throw error;
        }
    }

    /**
     * Retrieves ClubSupporters by club ID.
     * @param clubId - The ID of the club.
     * @returns A promise that resolves to an array of ClubSupporter or null.
     * @throws An error if there is a failure.
     */
    async getByClub(clubId: number): Promise<ClubSupporter[] | null> {
        try {
            return prisma.clubSupporter.findMany({
                where: {
                    clubId: clubId
                },
            });
        } catch (error) {
            log(`Error fetching ClubSupporters by club: ${error}`);
            throw error;
        }
    }

    /**
     * Creates a new ClubSupporter.
     * @param data The data for the new ClubSupporter.
     * @returns A promise that resolves to the created ClubSupporter, or null if an error occurs.
     * @throws An error if there is a failure.
     */
    async create(data: ClubSupporter): Promise<ClubSupporter | null> {
        try {
            return await prisma.clubSupporter.create({
                data: this.validate(data)
            });
        } catch (error) {
            log(`Error creating ClubSupporter: ${error}`);
            throw error;
        }
    }

    /**
     * Upserts a ClubSupporter.
     * @param data The data to be upserted.
     * @returns A promise that resolves to the upserted ClubSupporter, or null if the upsert failed.
     * @throws An error if there is a failure.
     */
    async upsert(data: ClubSupporter): Promise<ClubSupporter | null> {
        try {
            return await prisma.clubSupporter.upsert({
                where: {
                    playerId_clubId: {
                        playerId: data.playerId,
                        clubId: data.clubId
                    }
                },
                update: data,
                create: data,
            });
        } catch (error) {
            log(`Error upserting ClubSupporter: ${error}`);
            throw error;
        }
    }

    /**
     * Deletes a ClubSupporter.
     * @param playerId - The ID of the player.
     * @param clubId - The ID of the club.
     * @returns A Promise that resolves to void.
     * @throws An error if there is a failure.
     */
    async delete(playerId: number, clubId: number): Promise<void> {
        try {
            await prisma.clubSupporter.delete({
                where: {
                    playerId_clubId: {
                        playerId: playerId,
                        clubId: clubId
                    }
                },
            });
        } catch (error) {
            log(`Error deleting ClubSupporter: ${error}`);
            throw error;
        }
    }

    /**
     * Deletes all ClubSupporters.
     * @returns A promise that resolves when all ClubSupporters are deleted.
     * @throws An error if there is a failure.
     */
    async deleteAll(): Promise<void> {
        try {
            await prisma.clubSupporter.deleteMany();
        } catch (error) {
            log(`Error deleting ClubSupporter: ${error}`);
            throw error;
        }
    }
}

const clubSupporterService = new ClubSupporterService();
export default clubSupporterService;
