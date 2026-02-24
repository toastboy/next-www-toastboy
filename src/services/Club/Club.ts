import prisma from 'prisma/prisma';
import { ClubWhereUniqueInputObjectSchema } from 'prisma/zod/schemas';
import { ClubType } from 'prisma/zod/schemas/models/Club.schema';

import { normalizeUnknownError } from '@/lib/errors';
import { isPrismaNotFoundError } from '@/lib/prismaErrors';
import {
    ClubCreateOneStrictSchema,
    type ClubCreateWriteInput,
    ClubCreateWriteInputSchema,
    type ClubUpsertInput,
    ClubUpsertInputSchema,
    ClubUpsertOneStrictSchema,
} from '@/types/ClubStrictSchema';


export class ClubService {
    /**
     * Retrieves a single club by ID.
     * @param id - Club identifier.
     * @returns The matching club record, or `null` when no record exists.
     * @throws If input validation fails or the query fails.
     */
    async get(id: number): Promise<ClubType | null> {
        try {
            const where = ClubWhereUniqueInputObjectSchema.parse({ id });
            return prisma.club.findUnique({ where });
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Retrieves all club records.
     * @returns All clubs.
     * @throws If the query fails.
     */
    async getAll(): Promise<ClubType[]> {
        try {
            return prisma.club.findMany({});
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Creates a club from validated write input.
     * @param data - Club write payload.
     * @returns The created club record.
     * @throws If input validation fails or the create query fails.
     */
    async create(data: ClubCreateWriteInput): Promise<ClubType> {
        try {
            const writeData = ClubCreateWriteInputSchema.parse(data);
            const args = ClubCreateOneStrictSchema.parse({ data: writeData });
            return await prisma.club.create(args);
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Upserts a club keyed by `id`.
     *
     * Note: `id` is only used in `where`. Because create payloads never include
     * `id`, when no row matches the provided id Prisma will insert a new row with
     * a database-generated autoincrement id.
     * @param data - Club write payload.
     * @returns The created or updated club record.
     * @throws If input validation fails or the upsert query fails.
     */
    async upsert(data: ClubUpsertInput): Promise<ClubType> {
        try {
            const { id, ...writeData } = ClubUpsertInputSchema.parse(data);
            const updateData = {
                soccerwayId: writeData.soccerwayId,
                clubName: writeData.clubName,
                uri: writeData.uri,
                country: writeData.country,
            };
            const args = ClubUpsertOneStrictSchema.parse({
                where: { id },
                create: writeData,
                update: updateData,
            });
            return await prisma.club.upsert(args);
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Deletes a club by ID.
     *
     * Missing records are ignored: Prisma not-found (`P2025`) is swallowed.
     *
     * @param id - Club identifier.
     * @returns Resolves when delete handling completes.
     * @throws If input validation fails or delete fails for reasons other than not-found.
     */
    async delete(id: number): Promise<void> {
        try {
            const where = ClubWhereUniqueInputObjectSchema.parse({ id });
            await prisma.club.delete({ where });
        } catch (error) {
            if (isPrismaNotFoundError(error)) {
                return;
            }
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Deletes all club records.
     * @returns Resolves when all records are deleted.
     * @throws If the delete query fails.
     */
    async deleteAll(): Promise<void> {
        try {
            await prisma.club.deleteMany();
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }
}

const clubService = new ClubService();
export default clubService;
