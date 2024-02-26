import { club_supporter } from '@prisma/client';
import prisma from 'lib/prisma';
import debug from 'debug';

const log = debug('footy:api');

export class ClubSupporterService {
    /**
     * Validate a club_supporter
     * @param {club_supporter} club_supporter The club_supporter to validate
     * @returns the validated club_supporter
     * @throws An error if the club_supporter is invalid.
     */
    validate(club_supporter: club_supporter): club_supporter {
        if (!club_supporter.playerId || !Number.isInteger(club_supporter.playerId) || club_supporter.playerId < 0) {
            throw new Error(`Invalid playerId value: ${club_supporter.playerId}`);
        }
        if (!club_supporter.clubId || !Number.isInteger(club_supporter.clubId) || club_supporter.clubId < 0) {
            throw new Error(`Invalid clubId value: ${club_supporter.clubId}`);
        }

        return club_supporter;
    }

    /**
     * Retrieves a club supporter for the given player ID rated by club ID.
     * @param playerId - The ID of the player.
     * @param clubId - The ID of the club.
     * @returns A promise that resolves to the "club_supporter" object if found, otherwise null.
     * @throws An error if there is a failure.
     */
    async get(playerId: number, clubId: number): Promise<club_supporter | null> {
        try {
            return prisma.club_supporter.findUnique({
                where: {
                    playerId_clubId: {
                        playerId: playerId,
                        clubId: clubId
                    }
                },
            });
        } catch (error) {
            log(`Error fetching club_supporter: ${error}`);
            throw error;
        }
    }

    /**
     * Retrieves all club_supporters.
     * @returns A promise that resolves to an array of club_supporters or null if an error occurs.
     * @throws An error if there is a failure.
     */
    async getAll(): Promise<club_supporter[] | null> {
        try {
            return prisma.club_supporter.findMany({});
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
    async getByPlayer(playerId: number): Promise<club_supporter[] | null> {
        try {
            return prisma.club_supporter.findMany({
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
    async getByClub(clubId: number): Promise<club_supporter[] | null> {
        try {
            return prisma.club_supporter.findMany({
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
     * Creates a new club_supporter.
     * @param data The data for the new club_supporter.
     * @returns A promise that resolves to the created club_supporter, or null if an error occurs.
     * @throws An error if there is a failure.
     */
    async create(data: club_supporter): Promise<club_supporter | null> {
        try {
            return await prisma.club_supporter.create({
                data: this.validate(data)
            });
        } catch (error) {
            log(`Error creating club_supporter: ${error}`);
            throw error;
        }
    }

    /**
     * Upserts a club supporter.
     * @param data The data to be upserted.
     * @returns A promise that resolves to the upserted club_supporter, or null if the upsert failed.
     * @throws An error if there is a failure.
     */
    async upsert(data: club_supporter): Promise<club_supporter | null> {
        try {
            return await prisma.club_supporter.upsert({
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
            log(`Error upserting club_supporter: ${error}`);
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
            await prisma.club_supporter.delete({
                where: {
                    playerId_clubId: {
                        playerId: playerId,
                        clubId: clubId
                    }
                },
            });
        } catch (error) {
            log(`Error deleting club_supporter: ${error}`);
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
            await prisma.club_supporter.deleteMany();
        } catch (error) {
            log(`Error deleting club_supporters: ${error}`);
            throw error;
        }
    }
}

const clubSupporterService = new ClubSupporterService();
export default clubSupporterService;
