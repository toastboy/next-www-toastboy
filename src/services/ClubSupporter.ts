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
     * Upserts a ClubSupporter relation for the given player and club.
     *
     * Validates the composite unique key and payloads, then performs an atomic
     * Prisma `upsert` to either create the relation or update the existing one.
     * Errors are logged and rethrown for upstream handling.
     *
     * @param playerId - The unique identifier of the player.
     * @param clubId - The unique identifier of the club.
     * @returns A promise resolving to the created or updated ClubSupporter entity.
     *          The value should not be null under normal circumstances.
     * @throws ZodError If input validation fails.
     * @throws Prisma.PrismaClientKnownRequestError | Prisma.PrismaClientUnknownRequestError
     *         If the database operation fails.
     *
     * @example
     * const supporter = await clubSupporterService.upsert(123, 456);
     * // supporter.playerId === 123; supporter.clubId === 456
     *
     * @remarks
     * - Uniqueness is enforced by the composite key (playerId, clubId).
     * - The operation is idempotent: repeated calls with the same inputs yield the same relation.
     */
    async upsert(playerId: number, clubId: number): Promise<ClubSupporterType | null> {
        try {
            const where = ClubSupporterWhereUniqueInputObjectSchema.parse({
                playerId_clubId: { playerId, clubId },
            });
            const update = ClubSupporterUncheckedUpdateInputObjectStrictSchema.parse({ playerId, clubId });
            const create = ClubSupporterUncheckedCreateInputObjectStrictSchema.parse({ playerId, clubId });
            return await prisma.clubSupporter.upsert({ where, update, create });
        } catch (error) {
            log(`Error upserting ClubSupporter: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Inserts or updates a set of club supporter records for the specified
     * player in parallel.
     *
     * @param playerId - The unique identifier of the player whose club
     * supporter associations are being updated.
     * @param clubIds - An array of club identifiers to upsert for the given
     * player.
     * @returns A promise that resolves when all upsert operations complete
     * successfully.
     * @throws Will propagate any error encountered during the upsert
     * operations.
     */
    async upsertAll(playerId: number, clubIds: number[]) {
        try {
            await Promise.all(clubIds.map(
                (clubId) => this.upsert(playerId, clubId),
            ));
        } catch (error) {
            log(`Error upserting multiple ClubSupporters: ${String(error)}`);
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
     * Deletes all club supporter associations for the specified player except
     * those whose club IDs are provided to keep.
     *
     * The method fetches the player's current club supporters and removes any
     * association whose `clubId` is not present in the `keep` list. Deletions
     * are performed concurrently.
     *
     * @param playerId - The unique identifier of the player whose supporter
     * associations should be pruned.
     * @param keep - An array of club IDs to retain for the player; all other
     * existing associations will be deleted.
     * @returns A promise that resolves once all non-retained associations have
     * been deleted.
     * @throws Logs and rethrows any error encountered while reading or deleting
     * the player's club supporter associations.
     */
    async deleteExcept(playerId: number, keep: number[]) {
        try {
            const currentClubSupporters = await this.getByPlayer(playerId);
            const ClubSupportersToDelete = currentClubSupporters
                .filter((current) => !keep.some(
                    (cs) => cs === current.clubId,
                ));
            await Promise.all(ClubSupportersToDelete.map(
                (cs) => this.delete(cs.playerId, cs.clubId)),
            );
        } catch (error) {
            log(`Error deleting PlayerClubSupporters: ${String(error)}`);
            throw error;
        }
    }

    /**
     * Delete ClubSupporter records from the database.
     *
     * If a playerId is provided, only ClubSupporter records associated with
     * that player will be removed. If no playerId is provided, all
     * ClubSupporter records will be deleted.
     *
     * @param playerId - Optional player identifier to limit which records are
     * deleted.
     * @returns A promise that resolves when the deletion completes.
     * @throws Rethrows any error encountered while attempting to delete records
     * (errors are logged prior to being thrown).
     */
    async deleteAll(playerId?: number): Promise<void> {
        try {
            await prisma.clubSupporter.deleteMany({
                where: playerId ? { playerId } : undefined,
            });
        } catch (error) {
            log(`Error deleting ClubSupporter: ${String(error)}`);
            throw error;
        }
    }
}

const clubSupporterService = new ClubSupporterService();
export default clubSupporterService;
