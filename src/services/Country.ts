import 'server-only';

import debug from 'debug';
import prisma from 'lib/prisma';
import {
    CountryCreateInputObjectSchema,
    CountryType,
    CountryUpdateInputObjectSchema,
    CountryWhereUniqueInputObjectSchema,
} from 'prisma/generated/schemas';
import { z } from 'zod';

/** Defines a valid ISO country code */
const validISOCode = z.object({
    isoCode: z.string().regex(/^([A-Z]{2}|[A-Z]{2}-[A-Z]{3})$/, 'Invalid ISO code format'),
});

/** Schemas for enforcing strict input */
export const CountryCreateInputObjectStrictSchema = CountryCreateInputObjectSchema.and(validISOCode);
export const CountryUpdateInputObjectStrictSchema = CountryUpdateInputObjectSchema.and(validISOCode);

const log = debug('footy:api');

export class CountryService {
    /**
     * Retrieves a country by its ID.
     * @param id - The ID of the country to retrieve.
     * @returns A Promise that resolves to the country object if found, or null if not found.
     * @throws If there is an error while fetching the country.
     */
    async get(isoCode: string): Promise<CountryType | null> {
        try {
            const where = CountryWhereUniqueInputObjectSchema.parse({ isoCode });

            return prisma.country.findUnique({ where });
        } catch (error) {
            log(`Error fetching country: ${error}`);
            throw error;
        }
    }

    /**
     * Retrieves all countries.
     * @returns A promise that resolves to an array of countries or null if an error occurs.
     * @throws An error if there is a failure.
     */
    async getAll(): Promise<CountryType[]> {
        try {
            return prisma.country.findMany({});
        } catch (error) {
            log(`Error fetching countries: ${error}`);
            throw error;
        }
    }

    /**
     * Creates a new country.
     * @param data The data for the new country.
     * @returns A promise that resolves to the created country, or null if an error occurs.
     * @throws An error if there is a failure.
     */
    async create(rawData: unknown): Promise<CountryType | null> {
        try {
            const data = CountryCreateInputObjectStrictSchema.parse(rawData);

            return await prisma.country.create({ data });
        } catch (error) {
            log(`Error creating country: ${error}`);
            throw error;
        }
    }

    /**
     * Upserts a country.
     * @param data The data to be upserted.
     * @returns A promise that resolves to the upserted country, or null if the upsert failed.
     * @throws An error if there is a failure.
     */
    async upsert(rawData: unknown): Promise<CountryType | null> {
        try {
            const where = CountryWhereUniqueInputObjectSchema.parse(rawData);
            const update = CountryUpdateInputObjectStrictSchema.parse(rawData);
            const create = CountryCreateInputObjectStrictSchema.parse(rawData);

            return await prisma.country.upsert({ where, update, create });
        } catch (error) {
            log(`Error upserting country: ${error}`);
            throw error;
        }
    }

    /**
     * Deletes a country by its ID.
     * @param id - The ID of the country to delete.
     * @throws If there is an error deleting the country.
     */
    async delete(isoCode: string): Promise<void> {
        try {
            const where = CountryWhereUniqueInputObjectSchema.parse({ isoCode });

            await prisma.country.delete({ where });
        } catch (error) {
            log(`Error deleting country: ${error}`);
            throw error;
        }
    }

    /**
     * Deletes all countries.
     * @returns A promise that resolves when all countries are deleted.
     * @throws An error if there is a failure.
     */
    async deleteAll(): Promise<void> {
        try {
            await prisma.country.deleteMany();
        } catch (error) {
            log(`Error deleting countries: ${error}`);
            throw error;
        }
    }
}

const countryService = new CountryService();
export default countryService;
