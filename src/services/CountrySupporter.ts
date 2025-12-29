import 'server-only';

import debug from 'debug';
import prisma from 'prisma/prisma';
import {
    CountrySupporterUncheckedCreateInputObjectZodSchema,
    CountrySupporterUncheckedUpdateInputObjectZodSchema,
    CountrySupporterWhereInputObjectSchema,
    CountrySupporterWhereUniqueInputObjectSchema,
} from 'prisma/zod/schemas';
import {
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
     * Inserts or updates a country supporter entry for a given player and
     * country.
     *
     * Uses the composite key of player ID and country ISO code to determine
     * whether to update an existing record or create a new one. Validation is
     * performed before persistence, and any errors encountered are logged and
     * rethrown.
     *
     * @param playerId - The unique identifier of the player.
     * @param countryISOCode - The ISO country code to associate with the
     * player.
     * @returns The upserted country supporter record, or `null` if none is
     * created.
     * @throws Any validation or persistence errors encountered during the
     * operation.
     */
    async upsert(playerId: number, countryISOCode: string): Promise<CountrySupporterType | null> {
        try {
            const where = CountrySupporterWhereUniqueInputObjectSchema.parse({
                playerId_countryISOCode: { playerId, countryISOCode },
            });
            const update = CountrySupporterUncheckedUpdateInputObjectStrictSchema.parse({ playerId, countryISOCode });
            const create = CountrySupporterUncheckedCreateInputObjectStrictSchema.parse({ playerId, countryISOCode });
            return await prisma.countrySupporter.upsert({ where, update, create });
        } catch (error) {
            log(`Error upserting CountrySupporter: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Upserts multiple country supporter entries for a given player.
     *
     * Iterates through the provided ISO country codes and performs an upsert
     * operation for each, aggregating the promises for concurrent execution.
     *
     * @param playerId - The unique identifier of the player whose supporters
     * are being upserted.
     * @param countryISOCodes - An array of ISO country codes to upsert
     * supporter records for.
     * @throws If any upsert operation fails, the error is logged and rethrown.
     */
    async upsertAll(playerId: number, countryISOCodes: string[]) {
        try {
            await Promise.all(countryISOCodes.map(
                (countryISOCode) => this.upsert(playerId, countryISOCode)),
            );
        } catch (error) {
            log(`Error upserting multiple CountrySupporters: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Deletes all country supporters for the specified player except those
     * whose ISO codes are provided to keep.
     *
     * Retrieves the player's current country supporters, filters out entries
     * whose `countryISOCode` does not appear in `keep`, and deletes the
     * remainder concurrently.
     *
     * @param playerId - The numeric identifier of the player whose country
     * supporters should be pruned.
     * @param keep - A list of country ISO code strings to preserve; comparison
     * is strict and case-sensitive.
     * @returns A promise that resolves when all deletions have completed.
     * @throws Error - If fetching the player's current supporters fails or if
     * any delete operation rejects; the error is logged and rethrown.
     * @remarks
     * - Deletions are executed in parallel using `Promise.all`.
     * - This method is effectively idempotent for supporters already absent or
     *   included in the keep list.
     */
    async deleteExcept(playerId: number, keep: string[]) {
        try {
            const currentCountrySupporters = await this.getByPlayer(playerId);
            const CountrySupportersToDelete = currentCountrySupporters
                .filter((current) => !keep.some(
                    (cs) => cs === current.countryISOCode,
                ));
            await Promise.all(CountrySupportersToDelete.map(
                (cs) => this.delete(cs.playerId, cs.countryISOCode)),
            );
        } catch (error) {
            log(`Error deleting PlayerClubSupporters: ${String(error)}`);
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
