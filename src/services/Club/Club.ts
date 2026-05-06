import prisma from 'prisma/prisma';
import { ClubWhereUniqueInputObjectSchema } from 'prisma/zod/schemas';
import { ClubType } from 'prisma/zod/schemas/models/Club.schema';

import { isPrismaNotFoundError } from '@/lib/prismaErrors';
import {
    ClubCreateOneStrictSchema,
    type ClubCreateWriteInput,
    ClubCreateWriteInputSchema,
    type ClubUpsertInput,
    ClubUpsertInputSchema,
    ClubUpsertOneStrictSchema,
} from '@/types/ClubStrictSchema';


class ClubService {
    /**
     * Retrieves a single club by ID.
     * @param id - Club identifier.
     * @returns The matching club record, or `null` when no record exists.
     */
    async get(id: number): Promise<ClubType | null> {
        const where = ClubWhereUniqueInputObjectSchema.parse({ id });
        return prisma.club.findUnique({ where });
    }

    /**
     * Retrieves all club records.
     * @returns All clubs.
     */
    async getAll(): Promise<ClubType[]> {
        return prisma.club.findMany({});
    }

    /**
     * Creates a club from validated write input.
     * @param data - Club write payload.
     * @returns The created club record.
     */
    async create(data: ClubCreateWriteInput): Promise<ClubType> {
        const writeData = ClubCreateWriteInputSchema.parse(data);
        const args = ClubCreateOneStrictSchema.parse({ data: writeData });
        return prisma.club.create(args);
    }

    /**
     * Upserts a club keyed by `id`.
     *
     * Note: `id` is only used in `where`. Because create payloads never include
     * `id`, when no row matches the provided id Prisma will insert a new row with
     * a database-generated autoincrement id.
     * @param data - Club write payload.
     * @returns The created or updated club record.
     */
    async upsert(data: ClubUpsertInput): Promise<ClubType> {
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
        return prisma.club.upsert(args);
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
            if (isPrismaNotFoundError(error)) return;
            throw error;
        }
    }

    /**
     * Deletes all club records.
     * @returns Resolves when all records are deleted.
     */
    async deleteAll(): Promise<void> {
        await prisma.club.deleteMany();
    }
}

const clubService = new ClubService();
export default clubService;
