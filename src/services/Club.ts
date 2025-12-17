import 'server-only';

import debug from 'debug';
import prisma from 'lib/prisma';
import z from 'zod';

import {
    ClubUncheckedCreateInputObjectZodSchema,
    ClubUncheckedUpdateInputObjectZodSchema,
    ClubWhereUniqueInputObjectSchema,
} from '@/generated/zod/schemas';
import {
    ClubSchema,
    ClubType,
} from '@/generated/zod/schemas/models/Club.schema';

/** Field definitions with extra validation */
const extendedFields = {
    id: z.number().int().min(0),
};

/** Schemas for enforcing strict input */
export const ClubUncheckedCreateInputObjectStrictSchema =
    ClubUncheckedCreateInputObjectZodSchema.extend({
        ...extendedFields,
    });
export const ClubUncheckedUpdateInputObjectStrictSchema =
    ClubUncheckedUpdateInputObjectZodSchema.extend({
        ...extendedFields,
    });

const log = debug('footy:api');

export class ClubService {
    /**
     * Retrieves a club by its ID.
     * @param id - The ID of the club to retrieve.
     * @returns A Promise that resolves to the club object if found, or null if not found.
     * @throws If there is an error while fetching the club.
     */
    async get(id: number): Promise<ClubType | null> {
        try {
            const where = ClubWhereUniqueInputObjectSchema.parse({ id });

            return prisma.club.findUnique({ where });
        } catch (error) {
            log(`Error fetching club: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Retrieves all clubs.
     * @returns A promise that resolves to an array of clubs or null if an error occurs.
     * @throws An error if there is a failure.
     */
    async getAll(): Promise<ClubType[]> {
        try {
            return prisma.club.findMany({});
        } catch (error) {
            log(`Error fetching clubs: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Creates a new club.
     * @param data The data for the new club.
     * @returns A promise that resolves to the created club, or null if an error occurs.
     * @throws An error if there is a failure.
     */
    async create(rawData: unknown): Promise<ClubType | null> {
        try {
            const data = ClubUncheckedCreateInputObjectStrictSchema.parse(rawData);

            return await prisma.club.create({ data });
        } catch (error) {
            log(`Error creating club: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Upserts a club.
     * @param data The data to be upserted.
     * @returns A promise that resolves to the upserted club, or null if the upsert failed.
     * @throws An error if there is a failure.
     */
    async upsert(rawData: unknown): Promise<ClubType | null> {
        try {
            const parsed = ClubSchema.pick({ id: true }).parse(rawData);
            const where = ClubWhereUniqueInputObjectSchema.parse({
                id: parsed.id,
            });

            const update = ClubUncheckedUpdateInputObjectStrictSchema.parse(rawData);
            const create = ClubUncheckedCreateInputObjectStrictSchema.parse(rawData);

            return await prisma.club.upsert({ where, update, create });
        } catch (error) {
            log(`Error upserting club: ${String(error)}`);
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
            const where = ClubWhereUniqueInputObjectSchema.parse({ id });

            await prisma.club.delete({ where });
        } catch (error) {
            log(`Error deleting club: ${String(error)}`);
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
            log(`Error deleting clubs: ${String(error)}`);
            throw error;
        }
    }
}

const clubService = new ClubService();
export default clubService;
