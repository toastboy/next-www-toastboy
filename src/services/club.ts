import { club } from '@prisma/client';
import prisma from 'lib/prisma';
import debug from 'debug';

const log = debug('footy:api');

export class ClubService {
    /**
     * Validate a club
     * @param {club} club The club to validate
     * @returns the validated club
     * @throws An error if the club is invalid.
     */
    validate(club: club): club {
        if (!club.id || !Number.isInteger(club.id) || club.id < 0) {
            throw new Error(`Invalid id value: ${club.id}`);
        }

        return club;
    }

    /**
     * Retrieves a club by its ID.
     * @param id - The ID of the club to retrieve.
     * @returns A Promise that resolves to the club object if found, or null if not found.
     * @throws If there is an error while fetching the club.
     */
    async get(id: number): Promise<club | null> {
        try {
            return prisma.club.findUnique({
                where: {
                    id: id
                },
            });
        } catch (error) {
            log(`Error fetching club: ${error}`);
            throw error;
        }
    }

    /**
     * Retrieves all clubs.
     * @returns A promise that resolves to an array of clubs or null if an error occurs.
     * @throws An error if there is a failure.
     */
    async getAll(): Promise<club[] | null> {
        try {
            return prisma.club.findMany({});
        } catch (error) {
            log(`Error fetching clubs: ${error}`);
            throw error;
        }
    }

    /**
     * Creates a new club.
     * @param data The data for the new club.
     * @returns A promise that resolves to the created club, or null if an error occurs.
     * @throws An error if there is a failure.
     */
    async create(data: club): Promise<club | null> {
        try {
            return await prisma.club.create({
                data: this.validate(data)
            });
        } catch (error) {
            log(`Error creating club: ${error}`);
            throw error;
        }
    }

    /**
     * Upserts a club.
     * @param data The data to be upserted.
     * @returns A promise that resolves to the upserted club, or null if the upsert failed.
     * @throws An error if there is a failure.
     */
    async upsert(data: club): Promise<club | null> {
        try {
            return await prisma.club.upsert({
                where: {
                    id: data.id
                },
                update: data,
                create: data,
            });
        } catch (error) {
            log(`Error upserting club: ${error}`);
            throw error;
        }
    }

    /**
     * Deletes a club by its ID.
     * @param id - The ID of the club to delete.
     * @throws If there is an error deleting the club.
     */
    async delete(id: number): Promise<void> {
        try {
            await prisma.club.delete({
                where: {
                    id: id
                },
            });
        } catch (error) {
            log(`Error deleting club: ${error}`);
            throw error;
        }
    }

    /**
     * Deletes all clubs.
     * @returns A promise that resolves when all clubs are deleted.
     * @throws An error if there is a failure.
     */
    async deleteAll(): Promise<void> {
        try {
            await prisma.club.deleteMany();
        } catch (error) {
            log(`Error deleting clubs: ${error}`);
            throw error;
        }
    }
}

const clubService = new ClubService();
export default clubService;
