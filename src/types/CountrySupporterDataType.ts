import { z } from 'zod';

import { CountrySchema, CountrySupporterSchema } from '@/generated/zod/schemas';

export const CountrySupporterDataSchema = CountrySupporterSchema.extend({
    country: CountrySchema,
});

export type CountrySupporterDataType = z.infer<typeof CountrySupporterDataSchema>;
