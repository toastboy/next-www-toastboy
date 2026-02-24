import prisma from 'prisma/prisma';
import {
    ClubSupporterWhereInputObjectSchema,
    ClubSupporterWhereUniqueInputObjectSchema,
} from 'prisma/zod/schemas';
import { ClubSupporterType } from 'prisma/zod/schemas/models/ClubSupporter.schema';

import { normalizeUnknownError } from '@/lib/errors';
import { isPrismaNotFoundError } from '@/lib/prismaErrors';
import { ClubSupporterDataType } from '@/types';
import {
    ClubSupporterCreateOneStrictSchema,
    ClubSupporterUpsertOneStrictSchema,
    type ClubSupporterWriteInput,
    ClubSupporterWriteInputSchema,
} from '@/types/ClubSupporterStrictSchema';


export class ClubSupporterService {
    /**
     * Fetches a single club-supporter relationship by its composite key.
     *
     * @param playerId - Player identifier in the composite key.
     * @param clubId - Club identifier in the composite key.
     * @returns The matching record, or `null` when no record exists.
     * @throws {z.ZodError} If key validation fails.
     * @throws {Error} If Prisma query execution fails.
     */
    async get(playerId: number, clubId: number): Promise<ClubSupporterType | null> {
        try {
            const where = ClubSupporterWhereUniqueInputObjectSchema.parse({
                playerId_clubId: { playerId, clubId },
            });
            return prisma.clubSupporter.findUnique({ where });
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Fetches all club-supporter relationships.
     *
     * @returns All club-supporter rows.
     * @throws {Error} If Prisma query execution fails.
     */
    async getAll(): Promise<ClubSupporterType[]> {
        try {
            return prisma.clubSupporter.findMany({});
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Fetches club-supporter relationships for a player, including club data.
     *
     * @param playerId - Player identifier to filter by.
     * @returns Matching relationships with `club` included.
     * @throws {z.ZodError} If filter validation fails.
     * @throws {Error} If Prisma query execution fails.
     */
    async getByPlayer(playerId: number): Promise<ClubSupporterDataType[]> {
        try {
            const where = ClubSupporterWhereInputObjectSchema.parse({ playerId });
            return prisma.clubSupporter.findMany({ where, include: { club: true } });
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Fetches club-supporter relationships for a club.
     *
     * @param clubId - Club identifier to filter by.
     * @returns Matching club-supporter rows.
     * @throws {z.ZodError} If filter validation fails.
     * @throws {Error} If Prisma query execution fails.
     */
    async getByClub(clubId: number): Promise<ClubSupporterType[]> {
        try {
            const where = ClubSupporterWhereInputObjectSchema.parse({ clubId });
            return prisma.clubSupporter.findMany({ where });
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Creates a club-supporter relationship.
     *
     * Validates the write payload, then validates Prisma create args
     * before executing the create mutation.
     *
     * @param data - Write payload containing `playerId` and `clubId`.
     * @returns The created club-supporter row.
     * @throws {z.ZodError} If input validation fails.
     * @throws {Error} If Prisma mutation fails.
     */
    async create(data: ClubSupporterWriteInput): Promise<ClubSupporterType> {
        try {
            const writeData = ClubSupporterWriteInputSchema.parse(data);
            const args = ClubSupporterCreateOneStrictSchema.parse({ data: writeData });
            return prisma.clubSupporter.create(args);
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Upserts a club-supporter relationship by composite key.
     *
     * The same validated payload is used for `create` and `update`, so the
     * operation is idempotent for repeated calls with identical data.
     *
     * @param data - Write payload containing `playerId` and `clubId`.
     * @returns The created or updated row.
     * @throws {z.ZodError} If input validation fails.
     * @throws {Error} If Prisma mutation fails.
     */
    async upsert(data: ClubSupporterWriteInput): Promise<ClubSupporterType> {
        try {
            const writeData = ClubSupporterWriteInputSchema.parse(data);
            const args = ClubSupporterUpsertOneStrictSchema.parse({
                where: {
                    playerId_clubId: {
                        playerId: writeData.playerId,
                        clubId: writeData.clubId,
                    },
                },
                create: writeData,
                update: writeData,
            });
            return await prisma.clubSupporter.upsert(args);
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Upserts multiple club-supporter relationships for a player in parallel.
     *
     * @param playerId - Player identifier for all upserts.
     * @param clubIds - Club identifiers to upsert for the player.
     * @returns Resolves when all upserts complete.
     * @throws {Error} Propagates the first upsert error encountered.
     */
    async upsertAll(playerId: number, clubIds: number[]) {
        try {
            await Promise.all(clubIds.map(
                (clubId) => this.upsert({ playerId, clubId }),
            ));
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Deletes a club-supporter relationship by composite key.
     *
     * Not-found deletes (`P2025`) are treated as no-ops.
     *
     * @param playerId - Player identifier in the composite key.
     * @param clubId - Club identifier in the composite key.
     * @returns Resolves when deletion is complete (or no-op on not found).
     * @throws {z.ZodError} If key validation fails.
     * @throws {Error} If Prisma delete fails for reasons other than not found.
     */
    async delete(playerId: number, clubId: number): Promise<void> {
        try {
            const where = ClubSupporterWhereUniqueInputObjectSchema.parse({
                playerId_clubId: { playerId, clubId },
            });

            await prisma.clubSupporter.delete({ where });
        } catch (error) {
            if (isPrismaNotFoundError(error)) {
                return;
            }
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Deletes all of a player's club-supporter relationships except retained IDs.
     *
     * @param playerId - Player identifier whose relationships are being pruned.
     * @param keep - Club IDs that should remain associated with the player.
     * @returns Resolves when all non-retained relationships are deleted.
     * @throws {Error} If fetch or delete operations fail.
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
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Deletes club-supporter relationships in bulk.
     *
     * @param playerId - Optional filter; when provided, only rows for this player are deleted.
     * @returns Resolves when bulk deletion completes.
     * @throws {Error} If Prisma deleteMany fails.
     */
    async deleteAll(playerId?: number): Promise<void> {
        try {
            await prisma.clubSupporter.deleteMany({
                where: playerId ? { playerId } : undefined,
            });
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }
}

const clubSupporterService = new ClubSupporterService();
export default clubSupporterService;
