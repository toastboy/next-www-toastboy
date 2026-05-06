import prisma from 'prisma/prisma';
import {
    CountrySupporterWhereInputObjectSchema,
    CountrySupporterWhereUniqueInputObjectSchema,
} from 'prisma/zod/schemas';
import { CountrySupporterType } from 'prisma/zod/schemas/models/CountrySupporter.schema';

import { isPrismaNotFoundError } from '@/lib/prismaErrors';
import { CountrySupporterDataType } from '@/types/CountrySupporterDataType';
import {
    CountrySupporterCreateOneStrictSchema,
    CountrySupporterUpsertOneStrictSchema,
    type CountrySupporterWriteInput,
    CountrySupporterWriteInputSchema,
} from '@/types/CountrySupporterStrictSchema';
import { CountrySupporterWithPlayerDataType } from '@/types/CountrySupporterWithPlayerDataType';


class CountrySupporterService {
    /**
     * Fetches a country-supporter relationship by its composite key.
     * @param playerId - Player identifier in the composite key.
     * @param countryFIFACode - Country FIFA code in the composite key.
     * @returns The matching row, or `null` when it does not exist.
     */
    async get(playerId: number, countryFIFACode: string): Promise<CountrySupporterType | null> {
        const where = CountrySupporterWhereUniqueInputObjectSchema.parse({
            playerId_countryFIFACode: { playerId, countryFIFACode },
        });
        return prisma.countrySupporter.findUnique({ where });
    }

    /**
     * Fetches all country-supporter relationships.
     * @returns All country-supporter rows.
     */
    async getAll(): Promise<CountrySupporterType[]> {
        return prisma.countrySupporter.findMany({});
    }

    /**
     * Fetches all country-supporter relationships with country data included.
     * @returns All country-supporter rows with nested `country` relation.
     */
    async getAllWithCountry(): Promise<CountrySupporterDataType[]> {
        return prisma.countrySupporter.findMany({ include: { country: true } });
    }

    /**
     * Fetches all country-supporter relationships with both country and player
     * data included.
     * @returns All country-supporter rows with nested `country` and `player` relations.
     */
    async getAllWithCountryAndPlayer(): Promise<CountrySupporterWithPlayerDataType[]> {
        return prisma.countrySupporter.findMany({ include: { country: true, player: true } });
    }

    /**
     * Fetches country-supporter relationships for a player, including country data.
     * @param playerId - Player identifier to filter by.
     * @returns Matching relationships with `country` included.
     */
    async getByPlayer(playerId: number): Promise<CountrySupporterDataType[]> {
        const where = CountrySupporterWhereInputObjectSchema.parse({ playerId });
        return prisma.countrySupporter.findMany({ where, include: { country: true } });
    }

    /**
     * Fetches country-supporter relationships for a country FIFA code.
     * @param countryFIFACode - Country FIFA code to filter by.
     * @returns Matching country-supporter rows.
     */
    async getByCountry(countryFIFACode: string): Promise<CountrySupporterType[]> {
        const where = CountrySupporterWhereInputObjectSchema.parse({ countryFIFACode });
        return prisma.countrySupporter.findMany({ where });
    }

    /**
     * Creates a country-supporter relationship from validated write input.
     * @param data - Write payload containing `playerId` and `countryFIFACode`.
     * @returns The created row.
     */
    async create(data: CountrySupporterWriteInput): Promise<CountrySupporterType> {
        const writeData = CountrySupporterWriteInputSchema.parse(data);
        const args = CountrySupporterCreateOneStrictSchema.parse({ data: writeData });
        return prisma.countrySupporter.create(args);
    }

    /**
     * Upserts a country-supporter relationship by composite key.
     * @param data - Write payload containing `playerId` and `countryFIFACode`.
     * @returns The created or updated row.
     */
    async upsert(data: CountrySupporterWriteInput): Promise<CountrySupporterType> {
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
        return prisma.countrySupporter.upsert(args);
    }

    /**
     * Upserts multiple country-supporter relationships for a player in parallel.
     * @param playerId - Player identifier for all upserts.
     * @param countryFIFACodes - Country FIFA codes to upsert for the player.
     * @returns Resolves when all upserts complete.
     */
    async upsertAll(playerId: number, countryFIFACodes: string[]) {
        await Promise.all(countryFIFACodes.map(
            (countryFIFACode) => this.upsert({ playerId, countryFIFACode }),
        ));
    }

    /**
     * Deletes all of a player's country-supporter relationships except retained FIFA codes.
     * @param playerId - Player identifier whose relationships are being pruned.
     * @param keep - Country FIFA codes that should remain associated with the player.
     * @returns Resolves when all non-retained relationships are deleted.
     */
    async deleteExcept(playerId: number, keep: string[]) {
        const currentCountrySupporters = await this.getByPlayer(playerId);
        const countrySupportersToDelete = currentCountrySupporters
            .filter((current) => !keep.some(
                (cs) => cs === current.countryFIFACode,
            ));
        await Promise.all(countrySupportersToDelete.map(
            (cs) => this.delete(cs.playerId, cs.countryFIFACode)),
        );
    }

    /**
     * Deletes a country-supporter relationship by composite key.
     *
     * Not-found deletes (`P2025`) are treated as no-ops.
     *
     * @param playerId - Player identifier in the composite key.
     * @param countryFIFACode - Country FIFA code in the composite key.
     * @returns Resolves when deletion handling completes.
     * @throws If Prisma delete fails for reasons other than not-found.
     */
    async delete(playerId: number, countryFIFACode: string): Promise<void> {
        try {
            const where = CountrySupporterWhereUniqueInputObjectSchema.parse({
                playerId_countryFIFACode: { playerId, countryFIFACode },
            });
            await prisma.countrySupporter.delete({ where });
        } catch (error) {
            if (isPrismaNotFoundError(error)) return;
            throw error;
        }
    }

    /**
     * Deletes country-supporter relationships in bulk.
     * @param playerId - Optional filter; when provided, only rows for this player are deleted.
     * @returns Resolves when bulk deletion completes.
     */
    async deleteAll(playerId?: number): Promise<void> {
        await prisma.countrySupporter.deleteMany({
            where: playerId ? { playerId } : undefined,
        });
    }
}

const countrySupporterService = new CountrySupporterService();
export default countrySupporterService;
