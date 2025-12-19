import 'server-only';

import debug from 'debug';
import prisma from 'prisma/prisma';
import {
    ClubSupporterUncheckedCreateInputObjectZodSchema,
    ClubSupporterUncheckedUpdateInputObjectZodSchema,
    ClubSupporterWhereInputObjectSchema,
    ClubSupporterWhereUniqueInputObjectSchema,
} from 'prisma/zod/schemas';
import {
    ClubSupporterSchema,
    ClubSupporterType,
} from 'prisma/zod/schemas/models/ClubSupporter.schema';
import z from 'zod';

import { ClubSupporterDataType } from '@/types';

/** Field definitions with extra validation */
const extendFields = {
    playerId: z.number().int().min(1),
    clubId: z.number().int().min(1),
};

/** Schemas for enforcing strict input */
export const ClubSupporterUncheckedCreateInputObjectStrictSchema =
    ClubSupporterUncheckedCreateInputObjectZodSchema.extend({
        ...extendFields,
    });
export const ClubSupporterUncheckedUpdateInputObjectStrictSchema =
    ClubSupporterUncheckedUpdateInputObjectZodSchema.extend({
        ...extendFields,
    });

const log = debug('footy:api');

export class ClubSupporterService {
    /**
     * Retrieves a ClubSupporter for the given player ID and club ID.
     * @param playerId - The ID of the player.
     * @param clubId - The ID of the club.
     * @returns A promise that resolves to the ClubSupporter if found, otherwise null.
     * @throws An error if there is a failure.
     */
    async get(playerId: number, clubId: number): Promise<ClubSupporterType | null> {
        try {
            const where = ClubSupporterWhereUniqueInputObjectSchema.parse({
                playerId_clubId: { playerId, clubId },
            });

            return prisma.clubSupporter.findUnique({ where });
        } catch (error) {
            log(`Error fetching ClubSupporter: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Retrieves all ClubSupporters.
     * @returns A promise that resolves to an array of ClubSupporters or null if an error occurs.
     * @throws An error if there is a failure.
     */
    async getAll(): Promise<ClubSupporterType[]> {
        try {
            return prisma.clubSupporter.findMany({});
        } catch (error) {
            log(`Error fetching ClubSupporters: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Retrieves ClubSupporters by player ID.
     * @param playerId - The ID of the player.
     * @returns A promise that resolves to an array of ClubSupporterData (which includes the club too) or null.
     * @throws An error if there is a failure.
     */
    async getByPlayer(playerId: number): Promise<ClubSupporterDataType[]> {
        try {
            const where = ClubSupporterWhereInputObjectSchema.parse({ playerId });

            return prisma.clubSupporter.findMany({ where, include: { club: true } });
        } catch (error) {
            log(`Error fetching ClubSupporters by player: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Retrieves ClubSupporters by club ID.
     * @param clubId - The ID of the club.
     * @returns A promise that resolves to an array of ClubSupporter or null.
     * @throws An error if there is a failure.
     */
    async getByClub(clubId: number): Promise<ClubSupporterType[]> {
        try {
            const where = ClubSupporterWhereInputObjectSchema.parse({ clubId });

            return prisma.clubSupporter.findMany({ where });
        } catch (error) {
            log(`Error fetching ClubSupporters by club: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Creates a new ClubSupporter.
     * @param data The data for the new ClubSupporter.
     * @returns A promise that resolves to the created ClubSupporter, or null if an error occurs.
     * @throws An error if there is a failure.
     */
    async create(rawData: unknown): Promise<ClubSupporterType | null> {
        try {
            const data = ClubSupporterUncheckedCreateInputObjectStrictSchema.parse(rawData);

            return prisma.clubSupporter.create({ data });
        } catch (error) {
            log(`Error creating ClubSupporter: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Upserts a ClubSupporter.
     * @param data The data to be upserted.
     * @returns A promise that resolves to the upserted ClubSupporter, or null if the upsert failed.
     * @throws An error if there is a failure.
     */
    async upsert(rawData: unknown): Promise<ClubSupporterType | null> {
        try {
            const parsed = ClubSupporterSchema.pick({
                playerId: true,
                clubId: true,
            }).parse(rawData);
            const where = ClubSupporterWhereUniqueInputObjectSchema.parse({
                playerId_clubId: { playerId: parsed.playerId, clubId: parsed.clubId },
            });
            const update = ClubSupporterUncheckedUpdateInputObjectStrictSchema.parse(rawData);
            const create = ClubSupporterUncheckedCreateInputObjectStrictSchema.parse(rawData);

            return await prisma.clubSupporter.upsert({ where, update, create });
        } catch (error) {
            log(`Error upserting ClubSupporter: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Deletes a ClubSupporter.
     * @param playerId - The ID of the player.
     * @param clubId - The ID of the club.
     * @returns A Promise that resolves to void.
     * @throws An error if there is a failure.
     */
    async delete(playerId: number, clubId: number): Promise<void> {
        try {
            const where = ClubSupporterWhereUniqueInputObjectSchema.parse({
                playerId_clubId: { playerId, clubId },
            });

            await prisma.clubSupporter.delete({ where });
        } catch (error) {
            log(`Error deleting ClubSupporter: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Deletes all ClubSupporters.
     * @returns A promise that resolves when all ClubSupporters are deleted.
     * @throws An error if there is a failure.
     */
    async deleteAll(): Promise<void> {
        try {
            await prisma.clubSupporter.deleteMany();
        } catch (error) {
            log(`Error deleting ClubSupporter: ${String(error)}`);
            throw error;
        }
    }
}

const clubSupporterService = new ClubSupporterService();
export default clubSupporterService;
