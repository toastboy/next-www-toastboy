import 'server-only';

import debug from 'debug';
import prisma from 'lib/prisma';
import {
    CountrySupporterCreateInputObjectSchema,
    CountrySupporterType,
    CountrySupporterUpdateInputObjectSchema,
    CountrySupporterWhereInputObjectSchema,
    CountrySupporterWhereUniqueInputObjectSchema,
} from 'prisma/generated/schemas';
import z from 'zod';

/** Defines a valid ISO country code */
const validISOCode = z.object({
    isoCode: z.string().regex(/^([A-Z]{2}|[A-Z]{2}-[A-Z]{3})$/, 'Invalid ISO code format'),
});

/** Schemas for enforcing strict input */
export const CountrySupporterCreateInputObjectStrictSchema = CountrySupporterCreateInputObjectSchema.and(validISOCode);
export const CountrySupporterUpdateInputObjectStrictSchema = CountrySupporterUpdateInputObjectSchema.and(validISOCode);

const log = debug('footy:api');

export class CountrySupporterService {
    /**
     * Retrieves a CountrySupporter for the given player ID and country ISO code.
     * @param playerId - The ID of the player.
     * @param countryISOCode - The ISO code of the country.
     * @returns A promise that resolves to the CountrySupporter if found, otherwise null.
     * @throws An error if there is a failure.
     */
    async get(playerId: number, countryISOCode: string): Promise<CountrySupporterType | null> {
        try {
            const where = CountrySupporterWhereUniqueInputObjectSchema.parse({ playerId, countryISOCode });

            return prisma.countrySupporter.findUnique({ where });
        } catch (error) {
            log(`Error fetching CountrySupporter: ${error}`);
            throw error;
        }
    }

    /**
     * Retrieves all CountrySupporters.
     * @returns A promise that resolves to an array of CountrySupporters or null if an error occurs.
     * @throws An error if there is a failure.
     */
    async getAll(): Promise<CountrySupporterType[]> {
        try {
            return prisma.countrySupporter.findMany({});
        } catch (error) {
            log(`Error fetching CountrySupporters: ${error}`);
            throw error;
        }
    }

    /**
     * Retrieves CountrySupporters by player ID.
     * @param playerId - The ID of the player.
     * @returns A promise that resolves to an array of CountrySupporterWithCountry objects or null.
     * @throws An error if there is a failure.
     */
    async getByPlayer(playerId: number): Promise<CountrySupporterType[] | null> {
        try {
            const where = CountrySupporterWhereInputObjectSchema.parse({ playerId });

            return prisma.countrySupporter.findMany({ where });
        } catch (error) {
            log(`Error fetching CountrySupporters by player: ${error}`);
            throw error;
        }
    }

    /**
     * Retrieves CountrySupporters by country ISO code.
     * @param countryISOCode - The ISO code of the country.
     * @returns A promise that resolves to an array of CountrySupporter or null.
     * @throws An error if there is a failure.
     */
    async getByCountry(countryISOCode: string): Promise<CountrySupporterType[] | null> {
        try {
            const where = CountrySupporterWhereInputObjectSchema.parse({ countryISOCode });

            return prisma.countrySupporter.findMany({ where });
        } catch (error) {
            log(`Error fetching CountrySupporters by ISO code: ${error}`);
            throw error;
        }
    }

    /**
     * Creates a new CountrySupporter.
     * @param data The data for the new CountrySupporter.
     * @returns A promise that resolves to the created CountrySupporter, or null if an error occurs.
     * @throws An error if there is a failure.
     */
    async create(rawData: unknown): Promise<CountrySupporterType | null> {
        try {
            const data = CountrySupporterCreateInputObjectSchema.parse(rawData);

            return await prisma.countrySupporter.create({ data });
        } catch (error) {
            log(`Error creating CountrySupporter: ${error}`);
            throw error;
        }
    }

    /**
     * Upserts a CountrySupporter.
     * @param data The data to be upserted.
     * @returns A promise that resolves to the upserted CountrySupporter, or null if the upsert failed.
     * @throws An error if there is a failure.
     */
    async upsert(rawData: unknown): Promise<CountrySupporterType | null> {
        try {
            const where = CountrySupporterWhereUniqueInputObjectSchema.parse(rawData);
            const update = CountrySupporterUpdateInputObjectSchema.parse(rawData);
            const create = CountrySupporterCreateInputObjectSchema.parse(rawData);

            return await prisma.countrySupporter.upsert({ where, update, create });
        } catch (error) {
            log(`Error upserting CountrySupporter: ${error}`);
            throw error;
        }
    }

    /**
     * Deletes a CountrySupporter.
     * @param playerId - The ID of the player.
     * @param countryISOCode - The ISO code of the country.
     * @returns A Promise that resolves to void.
     * @throws An error if there is a failure.
     */
    async delete(playerId: number, countryISOCode: string): Promise<void> {
        try {
            const where = CountrySupporterWhereUniqueInputObjectSchema.parse({ playerId, countryISOCode });

            await prisma.countrySupporter.delete({ where });
        } catch (error) {
            log(`Error deleting CountrySupporter: ${error}`);
            throw error;
        }
    }

    /**
     * Deletes all CountrySupporters.
     * @returns A promise that resolves when all CountrySupporters are deleted.
     * @throws An error if there is a failure.
     */
    async deleteAll(): Promise<void> {
        try {
            await prisma.countrySupporter.deleteMany();
        } catch (error) {
            log(`Error deleting CountrySupporter: ${error}`);
            throw error;
        }
    }
}

const countrySupporterService = new CountrySupporterService();
export default countrySupporterService;
