import prisma from 'prisma/prisma';
import { CountryWhereUniqueInputObjectSchema } from 'prisma/zod/schemas';
import { CountryType } from 'prisma/zod/schemas/models/Country.schema';

import { normalizeUnknownError } from '@/lib/errors';
import { isPrismaNotFoundError } from '@/lib/prismaErrors';
import {
    CountryCreateOneStrictSchema,
    CountryUpsertOneStrictSchema,
    type CountryWriteInput,
    CountryWriteInputSchema,
} from '@/types/CountryStrictSchema';


export class CountryService {
    /**
     * Fetches a country by ISO code.
     * @param isoCode - Country ISO code.
     * @returns The matching country, or `null` when it does not exist.
     * @throws {z.ZodError} If unique-filter validation fails.
     * @throws {Error} If Prisma query execution fails.
     */
    async get(isoCode: string): Promise<CountryType | null> {
        try {
            const where = CountryWhereUniqueInputObjectSchema.parse({ isoCode });
            return prisma.country.findUnique({ where });
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Fetches all countries.
     * @returns All country rows.
     * @throws {Error} If Prisma query execution fails.
     */
    async getAll(): Promise<CountryType[]> {
        try {
            return prisma.country.findMany({});
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Creates a country from validated write input.
     * @param data - Write payload containing `isoCode` and `name`.
     * @returns The created country row.
     * @throws {z.ZodError} If input or Prisma-args validation fails.
     * @throws {Error} If Prisma create fails.
     */
    async create(data: CountryWriteInput): Promise<CountryType> {
        try {
            const writeData = CountryWriteInputSchema.parse(data);
            const args = CountryCreateOneStrictSchema.parse({ data: writeData });
            return await prisma.country.create(args);
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Upserts a country by ISO code.
     * @param data - Write payload containing `isoCode` and `name`.
     * @returns The created or updated country row.
     * @throws {z.ZodError} If input or Prisma-args validation fails.
     * @throws {Error} If Prisma upsert fails.
     */
    async upsert(data: CountryWriteInput): Promise<CountryType> {
        try {
            const writeData = CountryWriteInputSchema.parse(data);
            const args = CountryUpsertOneStrictSchema.parse({
                where: { isoCode: writeData.isoCode },
                create: writeData,
                update: writeData,
            });
            return await prisma.country.upsert(args);
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Deletes a country by ISO code.
     *
     * Not-found deletes (`P2025`) are treated as no-ops.
     *
     * @param isoCode - Country ISO code.
     * @returns Resolves when deletion handling completes.
     * @throws {z.ZodError} If unique-filter validation fails.
     * @throws {Error} If Prisma delete fails for reasons other than not-found.
     */
    async delete(isoCode: string): Promise<void> {
        try {
            const where = CountryWhereUniqueInputObjectSchema.parse({ isoCode });

            await prisma.country.delete({ where });
        } catch (error) {
            if (isPrismaNotFoundError(error)) {
                return;
            }
            throw normalizeUnknownError(error);
        }
    }

    /**
     * Deletes all countries.
     * @returns Resolves when deletion completes.
     * @throws {Error} If Prisma deleteMany fails.
     */
    async deleteAll(): Promise<void> {
        try {
            await prisma.country.deleteMany();
        } catch (error) {
            throw normalizeUnknownError(error);
        }
    }
}

const countryService = new CountryService();
export default countryService;
