import type { CountrySchema, CountrySupporterSchema } from 'prisma/zod/schemas';
import type { z } from 'zod';

export type CountrySupporterDataType = z.infer<typeof CountrySupporterSchema> & {
    country: z.infer<typeof CountrySchema>;
};
