import { ClubSupporter } from '@prisma/client';
import prisma from 'lib/prisma';
import debug from 'debug';

const log = debug('footy:api');

export class ClubSupporterService {
    /**
    * Validate a ClubSuppor
     *te
    * @param {ClubSupporter} ClubSupporter T
     *he ClubSupporter to validate
     * @returns the validated ClubSupporter
    * @throws An error if the ClubSupporter is invalid.
     */
    validate(ClubSupporter:
        ClubSupporter): ClubSupporter {
        if (!ClubSupporter.playerId || !Number.isInteger(ClubSupporter
            .playerId) || ClubSupporter.playerId < 0) {
            throw new Error(`Invalid playerId value: ${ClubSupporter.playerId}`);
        }
        if (!ClubSupporter.clubId || !Number.isInteger(ClubSupporter
            .clubId) || ClubSupporter.clubId < 0) {
            throw new Error(`Invalid clubId value: ${ClubSupporter.clubId}`);
        }

        return ClubSupporter;
    }

    /**
     * Retrieves a club supporter for the given player ID rated by club ID.
     * @param playerId - The ID of the player.
     * @param clubId - The ID of the club.
    * @returns A promise that resolves to the "ClubSupporter" object if found, otherwise null.
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
     * Retrieves all club_supporters.
     * @returns A promise that resolves to an array of club_supporters or null if an error occurs.
     * @throws An error if there is a failure.
     */
    async getAll(): Promise<ClubSupporter[] | null> {
        try {
            return prisma.clubSupporter.findMany({});
        } catch (error) {
            log(`Error fetching club_supporters: ${error}`);
            throw error;
        }
    }

    /**
     * Retrieves club_supporters by player ID.
     * @param playerId - The ID of the player.
     * @returns A promise that resolves to an array of club_supporters or null.
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
            log(`Error fetching club_supporters by player: ${error}`);
            throw error;
        }
    }

    /**
     * Retrieves club_supporters by club ID.
     * @param clubId - The ID of the club.
     * @returns A promise that resolves to an array of club_supporters or null.
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
            log(`Error fetching club_supporters by club: ${error}`);
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
     * Upserts a club supporter.
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
     * Deletes a club supporter.
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
     * Deletes all club_supporters.
     * @returns A promise that resolves when all club_supporters are deleted.
     * @throws An error if there is a failure.
     */
    async deleteAll(): Promise<void> {
        try {
            await prisma.clubSupporter.deleteMany();
        } catch (error) {
            log(`Error deleting club_supporters: ${error}`);
            throw error;
        }
    }
}

const clubSupporterService = new ClubSupporterService();
export default clubSupporterService;
