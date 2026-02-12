import 'server-only';

import debug from 'debug';
import prisma from 'prisma/prisma';
import {
    ArseWhereInputObjectSchema,
    ArseWhereUniqueInputObjectSchema,
} from 'prisma/zod/schemas';
import { ArseType } from 'prisma/zod/schemas/models/Arse.schema';

import { isPrismaNotFoundError } from '@/lib/prismaErrors';
import {
    ArseCreateOneStrictSchema,
    ArseUpsertOneStrictSchema,
    type ArseWriteInput,
    ArseWriteInputSchema,
} from '@/types/ArseStrictSchema';

const log = debug('footy:api');

interface ArseAverageRatings {
    inGoal: number | null,
    running: number | null,
    shooting: number | null,
    passing: number | null,
    ballSkill: number | null,
    attacking: number | null,
    defending: number | null,
}

export class ArseService {
    /**
     * Retrieves a single arse record identified by the composite key.
     * @param playerId - Player identifier from the composite key.
     * @param raterId - Rater identifier from the composite key.
     * @returns The matching arse record, or `null` when no record exists.
     * @throws If input validation fails or the database query fails.
     */
    async get(playerId: number, raterId: number): Promise<ArseType | null> {
        try {
            const where = ArseWhereUniqueInputObjectSchema.parse({
                playerId_raterId: { playerId, raterId },
            });

            return prisma.arse.findUnique({ where });
        } catch (error) {
            log(`Error fetching arses: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Retrieves all arse records.
     * @returns All arse records.
     * @throws If the database query fails.
     */
    async getAll(): Promise<ArseType[]> {
        try {
            return prisma.arse.findMany({});
        } catch (error) {
            log(`Error fetching arses: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Retrieves average ratings for a single player across all raters.
     * @param playerId - Player identifier to aggregate ratings for.
     * @returns Average rating values for each category. Each value is `number | null`.
     * @throws If input validation fails or the aggregate query fails.
     */
    async getByPlayer(playerId: number): Promise<ArseAverageRatings> {
        try {
            const where = ArseWhereInputObjectSchema.parse({ playerId });
            const arsegregate = await prisma.arse.aggregate({
                where,
                _avg: {
                    inGoal: true,
                    running: true,
                    shooting: true,
                    passing: true,
                    ballSkill: true,
                    attacking: true,
                    defending: true,
                },
            });

            return arsegregate._avg;
        } catch (error) {
            log(`Error fetching arses by player: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Retrieves all arse records created by a single rater.
     * @param raterId - Rater identifier used to filter records.
     * @returns Arse records created by the given rater.
     * @throws If input validation fails or the database query fails.
     */
    async getByRater(raterId: number): Promise<ArseType[]> {
        try {
            const where = ArseWhereInputObjectSchema.parse({ raterId });

            return prisma.arse.findMany({ where });
        } catch (error) {
            log(`Error fetching arses by rater: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Creates an arse record from validated write input.
     * @param data - Write payload containing composite-key identifiers and ratings.
     * @returns The created arse record.
     * @throws If write input validation fails or the create query fails.
     */
    async create(data: ArseWriteInput): Promise<ArseType> {
        try {
            const writeData = ArseWriteInputSchema.parse(data);
            const args = ArseCreateOneStrictSchema.parse({ data: writeData });
            return await prisma.arse.create(args);
        } catch (error) {
            log(`Error creating arse: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Upserts an arse record keyed by `{ playerId, raterId }`.
     * @param data - Write payload containing composite-key identifiers and any subset of ratings.
     * @returns The created or updated arse record.
     * @throws If write input validation fails or the upsert query fails.
     */
    async upsert(data: ArseWriteInput): Promise<ArseType> {
        try {
            const writeData = ArseWriteInputSchema.parse(data);
            const args = ArseUpsertOneStrictSchema.parse({
                where: {
                    playerId_raterId: {
                        playerId: writeData.playerId,
                        raterId: writeData.raterId,
                    },
                },
                create: writeData,
                update: writeData,
            });
            return await prisma.arse.upsert(args);
        } catch (error) {
            log(`Error upserting arse: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Deletes a single arse record identified by the composite key.
     *
     * Missing records are ignored: Prisma not-found (`P2025`) is swallowed.
     *
     * @param playerId - Player identifier from the composite key.
     * @param raterId - Rater identifier from the composite key.
     * @returns Resolves when delete handling completes.
     * @throws If input validation fails or delete fails for reasons other than not-found.
     */
    async delete(playerId: number, raterId: number): Promise<void> {
        try {
            const where = ArseWhereUniqueInputObjectSchema.parse({
                playerId_raterId: { playerId, raterId },
            });
            await prisma.arse.delete({ where });
        } catch (error) {
            if (isPrismaNotFoundError(error)) {
                return;
            }
            log(`Error deleting arse: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Deletes all arse records.
     * @returns Resolves when all records are deleted.
     * @throws If the delete query fails.
     */
    async deleteAll(): Promise<void> {
        try {
            await prisma.arse.deleteMany();
        } catch (error) {
            log(`Error deleting arses: ${String(error)}`);
            throw error;
        }
    }
}

const arseService = new ArseService();
export default arseService;
