import { Prisma } from 'prisma/generated/client';
import {
    CountrySupporterCreateInputObjectZodSchema,
    CountrySupporterCreateOneZodSchema,
    CountrySupporterUncheckedCreateInputObjectZodSchema,
    CountrySupporterUncheckedUpdateInputObjectZodSchema,
    CountrySupporterUpdateInputObjectZodSchema,
    CountrySupporterUpdateOneZodSchema,
    CountrySupporterUpsertOneZodSchema,
} from 'prisma/zod/schemas';
import z from 'zod';

const COUNTRY_FIFA_CODE_REGEX = /^[A-Z]{3}$/;

const CountrySupporterStrictFields = {
    playerId: z.number().int().min(1),
    countryFIFACode: z.string().regex(COUNTRY_FIFA_CODE_REGEX, 'Invalid FIFA code format'),
};

export const CountrySupporterWriteInputSchema = z.object({
    ...CountrySupporterStrictFields,
}).strip();

export type CountrySupporterWriteInput = z.infer<typeof CountrySupporterWriteInputSchema>;

const CountrySupporterCreateDataStrictSchema = z.union([
    CountrySupporterCreateInputObjectZodSchema.extend(CountrySupporterStrictFields),
    CountrySupporterUncheckedCreateInputObjectZodSchema.extend(CountrySupporterStrictFields),
]);

const CountrySupporterCreateOneStrictZodSchema = CountrySupporterCreateOneZodSchema.extend({
    data: CountrySupporterCreateDataStrictSchema,
});

export const CountrySupporterCreateOneStrictSchema: z.ZodType<Prisma.CountrySupporterCreateArgs> =
    CountrySupporterCreateOneStrictZodSchema as unknown as z.ZodType<Prisma.CountrySupporterCreateArgs>;

const CountrySupporterUpdateDataStrictSchema = z.union([
    CountrySupporterUpdateInputObjectZodSchema.extend(CountrySupporterStrictFields),
    CountrySupporterUncheckedUpdateInputObjectZodSchema.extend(CountrySupporterStrictFields),
]);

const CountrySupporterUpdateOneStrictZodSchema = CountrySupporterUpdateOneZodSchema.extend({
    data: CountrySupporterUpdateDataStrictSchema,
});

export const CountrySupporterUpdateOneStrictSchema: z.ZodType<Prisma.CountrySupporterUpdateArgs> =
    CountrySupporterUpdateOneStrictZodSchema as unknown as z.ZodType<Prisma.CountrySupporterUpdateArgs>;

const CountrySupporterUpsertOneStrictZodSchema = CountrySupporterUpsertOneZodSchema.extend({
    create: CountrySupporterCreateDataStrictSchema,
    update: CountrySupporterUpdateDataStrictSchema,
});

export const CountrySupporterUpsertOneStrictSchema: z.ZodType<Prisma.CountrySupporterUpsertArgs> =
    CountrySupporterUpsertOneStrictZodSchema as unknown as z.ZodType<Prisma.CountrySupporterUpsertArgs>;
