import 'server-only';

import debug from 'debug';
import prisma from 'lib/prisma';
import {
    CountrySupporterUncheckedCreateInputObjectZodSchema,
    CountrySupporterUncheckedUpdateInputObjectZodSchema,
    CountrySupporterWhereInputObjectSchema,
    CountrySupporterWhereUniqueInputObjectSchema,
} from 'prisma/zod/schemas';
import {
    CountrySupporterSchema,
    CountrySupporterType,
} from 'prisma/zod/schemas/models/CountrySupporter.schema';
import z from 'zod';

import { CountrySupporterDataType } from '@/types/CountrySupporterDataType';

/** Field definitions with extra validation */
const extendFields = {
    playerId: z.number().int().min(1),
    countryISOCode: z.string().regex(/^([A-Z]{2}|[A-Z]{2}-[A-Z]{3})$/, 'Invalid ISO code format'),
};

/** Schemas for enforcing strict input */
export const CountrySupporterUncheckedCreateInputObjectStrictSchema =
    CountrySupporterUncheckedCreateInputObjectZodSchema.extend({
        ...extendFields,
    });
export const CountrySupporterUncheckedUpdateInputObjectStrictSchema =
    CountrySupporterUncheckedUpdateInputObjectZodSchema.extend({
        ...extendFields,
    });

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
            const where = CountrySupporterWhereUniqueInputObjectSchema.parse({
                playerId_countryISOCode: { playerId, countryISOCode },
            });

            return prisma.countrySupporter.findUnique({ where });
        } catch (error) {
            log(`Error fetching CountrySupporter: ${String(error)}`);
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
            log(`Error fetching CountrySupporters: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Retrieves CountrySupporters by player ID.
     * @param playerId - The ID of the player.
     * @returns A promise that resolves to an array of CountrySupporterDataType objects or null.
     * @throws An error if there is a failure.
     */
    async getByPlayer(playerId: number): Promise<CountrySupporterDataType[]> {
        try {
            const where = CountrySupporterWhereInputObjectSchema.parse({ playerId });

            return prisma.countrySupporter.findMany({ where, include: { country: true } });
        } catch (error) {
            log(`Error fetching CountrySupporters by player: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Retrieves CountrySupporters by country ISO code.
     * @param countryISOCode - The ISO code of the country.
     * @returns A promise that resolves to an array of CountrySupporter or null.
     * @throws An error if there is a failure.
     */
    async getByCountry(countryISOCode: string): Promise<CountrySupporterType[]> {
        try {
            const where = CountrySupporterWhereInputObjectSchema.parse({ countryISOCode });

            return prisma.countrySupporter.findMany({ where });
        } catch (error) {
            log(`Error fetching CountrySupporters by ISO code: ${String(error)}`);
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
            const data = CountrySupporterUncheckedCreateInputObjectStrictSchema.parse(rawData);

            return await prisma.countrySupporter.create({ data });
        } catch (error) {
            log(`Error creating CountrySupporter: ${String(error)}`);
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
            const parsed = CountrySupporterSchema.pick({
                playerId: true,
                countryISOCode: true,
            }).parse(rawData);
            const where = CountrySupporterWhereUniqueInputObjectSchema.parse({
                playerId_countryISOCode: {
                    playerId: parsed.playerId,
                    countryISOCode: parsed.countryISOCode,
                },
            });
            const update = CountrySupporterUncheckedUpdateInputObjectStrictSchema.parse(rawData);
            const create = CountrySupporterUncheckedCreateInputObjectStrictSchema.parse(rawData);

            return await prisma.countrySupporter.upsert({ where, update, create });
        } catch (error) {
            log(`Error upserting CountrySupporter: ${String(error)}`);
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
            const where = CountrySupporterWhereUniqueInputObjectSchema.parse({
                playerId_countryISOCode: { playerId, countryISOCode },
            });

            await prisma.countrySupporter.delete({ where });
        } catch (error) {
            log(`Error deleting CountrySupporter: ${String(error)}`);
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
            log(`Error deleting CountrySupporter: ${String(error)}`);
            throw error;
        }
    }
}

const countrySupporterService = new CountrySupporterService();
export default countrySupporterService;
