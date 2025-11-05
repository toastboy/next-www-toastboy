import 'server-only';

import debug from 'debug';
import prisma from 'lib/prisma';
import {
    ArseCreateInputObjectZodSchema,
    ArseType,
    ArseUpdateInputObjectZodSchema,
    ArseWhereInputObjectSchema,
    ArseWhereUniqueInputObjectSchema
} from "prisma/generated/schemas";
import { z } from 'zod';

/** 0..10 rating used across create and update */
const rating0to10 = z.number().int().min(0).max(10);

/** The seven rating fields, nullable + optional */
const ratingFields = {
    inGoal: rating0to10.nullable().optional(),
    running: rating0to10.nullable().optional(),
    shooting: rating0to10.nullable().optional(),
    passing: rating0to10.nullable().optional(),
    ballSkill: rating0to10.nullable().optional(),
    attacking: rating0to10.nullable().optional(),
    defending: rating0to10.nullable().optional(),
};

/** Schemas for enforcing strict input */
export const ArseCreateInputObjectStrictSchema = ArseCreateInputObjectZodSchema.extend({ ...ratingFields });
export const ArseUpdateInputObjectStrictSchema = ArseUpdateInputObjectZodSchema.extend({ ...ratingFields });

const log = debug('footy:api');

export class ArseService {
    /**
     * Retrieves an arse for the given player ID rated by rater ID.
     * @param playerId - The ID of the player.
     * @param raterId - The ID of the rater.
     * @returns A promise that resolves to the "arse" object if found, otherwise null.
     * @throws An error if there is a failure.
     */
    async get(playerId: number, raterId: number): Promise<ArseType | null> {
        try {
            const where = ArseWhereUniqueInputObjectSchema.parse({ playerId, raterId });

            return prisma.arse.findUnique({ where });
        } catch (error) {
            log(`Error fetching arses: ${error}`);
            throw error;
        }
    }

    /**
     * Retrieves all arses.
     * @returns A promise that resolves to an array of arses or null if an error occurs.
     * @throws An error if there is a failure.
     */
    async getAll(): Promise<ArseType[]> {
        try {
            return prisma.arse.findMany({});
        } catch (error) {
            log(`Error fetching arses: ${error}`);
            throw error;
        }
    }

    /**
     * Retrieves arses by player ID.
     * @param playerId - The ID of the player.
     * @returns A promise that resolves to an array of arses or null.
     * @throws An error if there is a failure.
     */
    async getByPlayer(playerId: number): Promise<Partial<ArseType> | null> {
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
            log(`Error fetching arses by player: ${error}`);
            throw error;
        }
    }

    /**
     * Retrieves arses by rater ID.
     * @param raterId - The ID of the rater.
     * @returns A promise that resolves to an array of arses or null.
     * @throws An error if there is a failure.
     */
    async getByRater(raterId: number): Promise<ArseType[] | null> {
        try {
            const where = ArseWhereInputObjectSchema.parse({ raterId });

            return prisma.arse.findMany({ where });
        } catch (error) {
            log(`Error fetching arses by rater: ${error}`);
            throw error;
        }
    }

    /**
     * Creates a new arse.
     * @param data The data for the new arse.
     * @returns A promise that resolves to the created arse, or null if an error occurs.
     * @throws An error if there is a failure.
     */
    async create(rawData: unknown): Promise<ArseType | null> {
        try {
            const data = ArseCreateInputObjectStrictSchema.parse(rawData);

            return await prisma.arse.create({ data });
        } catch (error) {
            log(`Error creating arse: ${error}`);
            throw error;
        }
    }

    /**
     * Upserts an arse.
     * @param data The data to be upserted.
     * @returns A promise that resolves to the upserted arse, or null if the upsert failed.
     * @throws An error if there is a failure.
     */
    async upsert(rawData: unknown): Promise<ArseType | null> {
        try {
            const where = ArseWhereUniqueInputObjectSchema.parse(rawData);
            const update = ArseUpdateInputObjectStrictSchema.parse(rawData);
            const create = ArseCreateInputObjectStrictSchema.parse(rawData);

            return await prisma.arse.upsert({ where, update, create });
        } catch (error) {
            log(`Error upserting arse: ${error}`);
            throw error;
        }
    }

    /**
     * Deletes an arse.
     * @param playerId - The ID of the player.
     * @param raterId - The ID of the rater.
     * @returns A Promise that resolves to void.
     * @throws An error if there is a failure.
     */
    async delete(playerId: number, raterId: number): Promise<void> {
        try {
            const where = ArseWhereUniqueInputObjectSchema.parse({ playerId, raterId });

            await prisma.arse.delete({ where });
        } catch (error) {
            log(`Error deleting arse: ${error}`);
            throw error;
        }
    }

    /**
     * Deletes all arses.
     * @returns A promise that resolves when all arses are deleted.
     * @throws An error if there is a failure.
     */
    async deleteAll(): Promise<void> {
        try {
            await prisma.arse.deleteMany();
        } catch (error) {
            log(`Error deleting arses: ${error}`);
            throw error;
        }
    }
}

const arseService = new ArseService();
export default arseService;
