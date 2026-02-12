import { Prisma } from 'prisma/generated/client';
import {
    CountryCreateInputObjectZodSchema,
    CountryCreateOneZodSchema,
    CountryUncheckedCreateInputObjectZodSchema,
    CountryUncheckedUpdateInputObjectZodSchema,
    CountryUpdateInputObjectZodSchema,
    CountryUpdateOneZodSchema,
    CountryUpsertOneZodSchema,
} from 'prisma/zod/schemas';
import z from 'zod';

const COUNTRY_ISO_CODE_REGEX = /^([A-Z]{2}|[A-Z]{2}-[A-Z]{3})$/;

const CountryCreateStrictFields = {
    isoCode: z.string().regex(COUNTRY_ISO_CODE_REGEX, 'Invalid ISO code format'),
    name: z.string().trim().min(1).max(255),
};

const CountryUpdateStrictFields = {
    isoCode: z.string().regex(COUNTRY_ISO_CODE_REGEX, 'Invalid ISO code format').optional(),
    name: z.string().trim().min(1).max(255).optional(),
};

export const CountryWriteInputSchema = z.object({
    isoCode: CountryCreateStrictFields.isoCode,
    name: CountryCreateStrictFields.name,
}).strip();

export type CountryWriteInput = z.infer<typeof CountryWriteInputSchema>;

const CountryCreateDataStrictSchema = z.union([
    CountryCreateInputObjectZodSchema.extend(CountryCreateStrictFields),
    CountryUncheckedCreateInputObjectZodSchema.extend(CountryCreateStrictFields),
]);

const CountryCreateOneStrictZodSchema = CountryCreateOneZodSchema.extend({
    data: CountryCreateDataStrictSchema,
});

export const CountryCreateOneStrictSchema: z.ZodType<Prisma.CountryCreateArgs> =
    CountryCreateOneStrictZodSchema as unknown as z.ZodType<Prisma.CountryCreateArgs>;

const CountryUpdateDataStrictSchema = z.union([
    CountryUpdateInputObjectZodSchema.extend(CountryUpdateStrictFields),
    CountryUncheckedUpdateInputObjectZodSchema.extend(CountryUpdateStrictFields),
]);

const CountryUpdateOneStrictZodSchema = CountryUpdateOneZodSchema.extend({
    data: CountryUpdateDataStrictSchema,
});

export const CountryUpdateOneStrictSchema: z.ZodType<Prisma.CountryUpdateArgs> =
    CountryUpdateOneStrictZodSchema as unknown as z.ZodType<Prisma.CountryUpdateArgs>;

const CountryUpsertOneStrictZodSchema = CountryUpsertOneZodSchema.extend({
    create: CountryCreateDataStrictSchema,
    update: CountryUpdateDataStrictSchema,
});

export const CountryUpsertOneStrictSchema: z.ZodType<Prisma.CountryUpsertArgs> =
    CountryUpsertOneStrictZodSchema as unknown as z.ZodType<Prisma.CountryUpsertArgs>;
