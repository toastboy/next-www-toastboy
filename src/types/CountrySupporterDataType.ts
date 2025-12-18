import { CountrySchema, CountrySupporterSchema } from 'prisma/zod/schemas';
import { z } from 'zod';

export const CountrySupporterDataSchema = CountrySupporterSchema.extend({
    country: CountrySchema,
});

export type CountrySupporterDataType = z.infer<typeof CountrySupporterDataSchema>;
