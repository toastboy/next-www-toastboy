import prisma from 'prisma/prisma';
import {
    CountrySupporterWhereInputObjectSchema,
    CountrySupporterWhereUniqueInputObjectSchema,
} from 'prisma/zod/schemas';
import { CountrySupporterType } from 'prisma/zod/schemas/models/CountrySupporter.schema';

import { normalizeUnknownError } from '@/lib/errors';
import { isPrismaNotFoundError } from '@/lib/prismaErrors';
import { CountrySupporterDataType } from '@/types/CountrySupporterDataType';
import {
    CountrySupporterCreateOneStrictSchema,
    CountrySupporterUpsertOneStrictSchema,
    type CountrySupporterWriteInput,
    CountrySupporterWriteInputSchema,
} from '@/types/CountrySupporterStrictSchema';
import { CountrySupporterWithPlayerDataType } from '@/types/CountrySupporterWithPlayerDataType';


export class CountrySupporterService {
    /**
     * Fetches a country-supporter relationship by its composite key.
     * @param playerId - Player identifier in the composite key.
     * @param countryFIFACode - Country FIFA code in the composite key.
     * @returns The matching row, or `null` when it does not exist.
     * @throws {z.ZodError} If unique-filter validation fails.
     * @throws {Error} If Prisma query execution fails.
     */
    async get(playerId: number, countryFIFACode: string): Promise<CountrySupporterType | null> {
        try {
            const where = CountrySupporterWhereUniqueInputObjectSchema.parse({
                playerId_countryFIFACode: { playerId, countryFIFACode },
            });

            return prisma.countrySupporter.findUnique({ where });
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Fetches all country-supporter relationships.
     * @returns All country-supporter rows.
     * @throws {Error} If Prisma query execution fails.
     */
    async getAll(): Promise<CountrySupporterType[]> {
        try {
            return prisma.countrySupporter.findMany({});
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Fetches all country-supporter relationships with country data included.
     * @returns All country-supporter rows with nested `country` relation.
     * @throws {Error} If Prisma query execution fails.
     */
    async getAllWithCountry(): Promise<CountrySupporterDataType[]> {
        try {
            return prisma.countrySupporter.findMany({ include: { country: true } });
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Fetches all country-supporter relationships with both country and player
     * data included.
     * @returns All country-supporter rows with nested `country` and `player` relations.
     * @throws {Error} If Prisma query execution fails.
     */
    async getAllWithCountryAndPlayer(): Promise<CountrySupporterWithPlayerDataType[]> {
        try {
            return prisma.countrySupporter.findMany({ include: { country: true, player: true } });
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Fetches country-supporter relationships for a player, including country data.
     * @param playerId - Player identifier to filter by.
     * @returns Matching relationships with `country` included.
     * @throws {z.ZodError} If filter validation fails.
     * @throws {Error} If Prisma query execution fails.
     */
    async getByPlayer(playerId: number): Promise<CountrySupporterDataType[]> {
        try {
            const where = CountrySupporterWhereInputObjectSchema.parse({ playerId });
            return prisma.countrySupporter.findMany({ where, include: { country: true } });
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Fetches country-supporter relationships for a country FIFA code.
     * @param countryFIFACode - Country FIFA code to filter by.
     * @returns Matching country-supporter rows.
     * @throws {z.ZodError} If filter validation fails.
     * @throws {Error} If Prisma query execution fails.
     */
    async getByCountry(countryFIFACode: string): Promise<CountrySupporterType[]> {
        try {
            const where = CountrySupporterWhereInputObjectSchema.parse({ countryFIFACode });
            return prisma.countrySupporter.findMany({ where });
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Creates a country-supporter relationship from validated write input.
     * @param data - Write payload containing `playerId` and `countryFIFACode`.
     * @returns The created row.
     * @throws {z.ZodError} If input or Prisma-args validation fails.
     * @throws {Error} If Prisma create fails.
     */
    async create(data: CountrySupporterWriteInput): Promise<CountrySupporterType> {
        try {
            const writeData = CountrySupporterWriteInputSchema.parse(data);
            const args = CountrySupporterCreateOneStrictSchema.parse({ data: writeData });
            return await prisma.countrySupporter.create(args);
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Upserts a country-supporter relationship by composite key.
     * @param data - Write payload containing `playerId` and `countryFIFACode`.
     * @returns The created or updated row.
     * @throws {z.ZodError} If input or Prisma-args validation fails.
     * @throws {Error} If Prisma upsert fails.
     */
    async upsert(data: CountrySupporterWriteInput): Promise<CountrySupporterType> {
        try {
            const writeData = CountrySupporterWriteInputSchema.parse(data);
            const args = CountrySupporterUpsertOneStrictSchema.parse({
                where: {
                    playerId_countryFIFACode: {
                        playerId: writeData.playerId,
                        countryFIFACode: writeData.countryFIFACode,
                    },
                },
                create: writeData,
                update: writeData,
            });
            return await prisma.countrySupporter.upsert(args);
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Upserts multiple country-supporter relationships for a player in parallel.
     * @param playerId - Player identifier for all upserts.
     * @param countryFIFACodes - Country FIFA codes to upsert for the player.
     * @returns Resolves when all upserts complete.
     * @throws {Error} Propagates the first upsert error encountered.
     */
    async upsertAll(playerId: number, countryFIFACodes: string[]) {
        try {
            await Promise.all(countryFIFACodes.map(
                (countryFIFACode) => this.upsert({ playerId, countryFIFACode }),
            ));
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Deletes all of a player's country-supporter relationships except retained FIFA codes.
     * @param playerId - Player identifier whose relationships are being pruned.
     * @param keep - Country FIFA codes that should remain associated with the player.
     * @returns Resolves when all non-retained relationships are deleted.
     * @throws {Error} If fetch or delete operations fail.
     */
    async deleteExcept(playerId: number, keep: string[]) {
        try {
            const currentCountrySupporters = await this.getByPlayer(playerId);
            const countrySupportersToDelete = currentCountrySupporters
                .filter((current) => !keep.some(
                    (cs) => cs === current.countryFIFACode,
                ));
            await Promise.all(countrySupportersToDelete.map(
                (cs) => this.delete(cs.playerId, cs.countryFIFACode)),
            );
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Deletes a country-supporter relationship by composite key.
     *
     * Not-found deletes (`P2025`) are treated as no-ops.
     *
     * @param playerId - Player identifier in the composite key.
     * @param countryFIFACode - Country FIFA code in the composite key.
     * @returns Resolves when deletion handling completes.
     * @throws {z.ZodError} If key validation fails.
     * @throws {Error} If Prisma delete fails for reasons other than not-found.
     */
    async delete(playerId: number, countryFIFACode: string): Promise<void> {
        try {
            const where = CountrySupporterWhereUniqueInputObjectSchema.parse({
                playerId_countryFIFACode: { playerId, countryFIFACode },
            });

            await prisma.countrySupporter.delete({ where });
        } catch (error) {
            if (isPrismaNotFoundError(error)) {
                return;
            }
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Deletes country-supporter relationships in bulk.
     * @param playerId - Optional filter; when provided, only rows for this player are deleted.
     * @returns Resolves when bulk deletion completes.
     * @throws {Error} If Prisma deleteMany fails.
     */
    async deleteAll(playerId?: number): Promise<void> {
        try {
            await prisma.countrySupporter.deleteMany({
                where: playerId ? { playerId } : undefined,
            });
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }
}

const countrySupporterService = new CountrySupporterService();
export default countrySupporterService;
