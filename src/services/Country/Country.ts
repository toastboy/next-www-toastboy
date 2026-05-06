import prisma from 'prisma/prisma';
import { CountryWhereUniqueInputObjectSchema } from 'prisma/zod/schemas';
import { CountryType } from 'prisma/zod/schemas/models/Country.schema';

import { isPrismaNotFoundError } from '@/lib/prismaErrors';
import {
    CountryCreateOneStrictSchema,
    CountryUpsertOneStrictSchema,
    type CountryWriteInput,
    CountryWriteInputSchema,
} from '@/types/CountryStrictSchema';


class CountryService {
    /**
     * Fetches a country by FIFA code.
     * @param fifaCode - Country FIFA code.
     * @returns The matching country, or `null` when it does not exist.
     */
    async get(fifaCode: string): Promise<CountryType | null> {
        const where = CountryWhereUniqueInputObjectSchema.parse({ fifaCode });
        return prisma.country.findUnique({ where });
    }

    /**
     * Fetches all countries.
     * @returns All country rows.
     */
    async getAll(): Promise<CountryType[]> {
        return prisma.country.findMany({});
    }

    /**
     * Creates a country from validated write input.
     * @param data - Write payload containing `fifaCode` and `name`.
     * @returns The created country row.
     */
    async create(data: CountryWriteInput): Promise<CountryType> {
        const writeData = CountryWriteInputSchema.parse(data);
        const args = CountryCreateOneStrictSchema.parse({ data: writeData });
        return prisma.country.create(args);
    }

    /**
     * Upserts a country by FIFA code.
     * @param data - Write payload containing `fifaCode` and `name`.
     * @returns The created or updated country row.
     */
    async upsert(data: CountryWriteInput): Promise<CountryType> {
        const writeData = CountryWriteInputSchema.parse(data);
        const args = CountryUpsertOneStrictSchema.parse({
            where: { fifaCode: writeData.fifaCode },
            create: writeData,
            update: writeData,
        });
        return prisma.country.upsert(args);
    }

    /**
     * Deletes a country by FIFA code.
     *
     * Not-found deletes (`P2025`) are treated as no-ops.
     *
     * @param fifaCode - Country FIFA code.
     * @returns Resolves when deletion handling completes.
     * @throws If Prisma delete fails for reasons other than not-found.
     */
    async delete(fifaCode: string): Promise<void> {
        try {
            const where = CountryWhereUniqueInputObjectSchema.parse({ fifaCode });
            await prisma.country.delete({ where });
        } catch (error) {
            if (isPrismaNotFoundError(error)) return;
            throw error;
        }
    }

    /**
     * Deletes all countries.
     * @returns Resolves when deletion completes.
     */
    async deleteAll(): Promise<void> {
        await prisma.country.deleteMany();
    }
}

const countryService = new CountryService();
export default countryService;
