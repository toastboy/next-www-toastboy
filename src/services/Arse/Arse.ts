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


interface ArseAverageRatings {
    inGoal: number | null,
    running: number | null,
    shooting: number | null,
    passing: number | null,
    ballSkill: number | null,
    attacking: number | null,
    defending: number | null,
}

class ArseService {
    /**
     * Retrieves a single arse record identified by the composite key.
     * @param playerId - Player identifier from the composite key.
     * @param raterId - Rater identifier from the composite key.
     * @returns The matching arse record, or `null` when no record exists.
     * @throws If input validation fails or the database query fails.
     */
    async get(playerId: number, raterId: number): Promise<ArseType | null> {
        const where = ArseWhereUniqueInputObjectSchema.parse({
            playerId_raterId: { playerId, raterId },
        });

        return prisma.arse.findUnique({ where });
    }

    /**
     * Retrieves all arse records.
     * @returns All arse records.
     * @throws If the database query fails.
     */
    async getAll(): Promise<ArseType[]> {
        return prisma.arse.findMany({});
    }

    /**
     * Retrieves average ratings for a single player across all raters.
     * @param playerId - Player identifier to aggregate ratings for.
     * @returns Average rating values for each category. Each value is `number | null`.
     * @throws If input validation fails or the aggregate query fails.
     */
    async getByPlayer(playerId: number): Promise<ArseAverageRatings> {
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
    }

    /**
     * Retrieves all arse records created by a single rater.
     * @param raterId - Rater identifier used to filter records.
     * @returns Arse records created by the given rater.
     * @throws If input validation fails or the database query fails.
     */
    async getByRater(raterId: number): Promise<ArseType[]> {
        const where = ArseWhereInputObjectSchema.parse({ raterId });

        return prisma.arse.findMany({ where });
    }

    /**
     * Creates an arse record from validated write input.
     * @param data - Write payload containing composite-key identifiers and ratings.
     * @returns The created arse record.
     * @throws If write input validation fails or the create query fails.
     */
    async create(data: ArseWriteInput): Promise<ArseType> {
        const writeData = ArseWriteInputSchema.parse(data);
        const args = ArseCreateOneStrictSchema.parse({ data: writeData });
        return prisma.arse.create(args);
    }

    /**
     * Upserts an arse record keyed by `{ playerId, raterId }`.
     * @param data - Write payload containing composite-key identifiers and any subset of ratings.
     * @returns The created or updated arse record.
     * @throws If write input validation fails or the upsert query fails.
     */
    async upsert(data: ArseWriteInput): Promise<ArseType> {
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
        return prisma.arse.upsert(args);
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
            if (isPrismaNotFoundError(error)) return;
            throw error;
        }
    }

    /**
     * Deletes all arse records.
     * @returns Resolves when all records are deleted.
     * @throws If the delete query fails.
     */
    async deleteAll(): Promise<void> {
        await prisma.arse.deleteMany();
    }
}

const arseService = new ArseService();
export default arseService;
