import { CountrySchema, CountrySupporterSchema } from 'prisma/generated/schemas';
import { z } from 'zod';

export const CountrySupporterDataSchema = CountrySupporterSchema.extend({
    country: CountrySchema,
});

export type CountrySupporterDataType = z.infer<typeof CountrySupporterDataSchema>;
