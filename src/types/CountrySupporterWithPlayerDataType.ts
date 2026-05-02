import type { PlayerSchema } from 'prisma/zod/schemas';
import type { z } from 'zod';

import type { CountrySupporterDataType } from './CountrySupporterDataType';

/** Country-supporter row with both `country` and `player` relations included. */
export type CountrySupporterWithPlayerDataType = CountrySupporterDataType & {
    /** Player associated with this country-supporter entry. */
    player: z.infer<typeof PlayerSchema>;
};
