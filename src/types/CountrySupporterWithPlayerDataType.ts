import { PlayerSchema } from 'prisma/zod/schemas/models/Player.schema';
import { z } from 'zod';

import { CountrySupporterDataSchema } from './CountrySupporterDataType';

/** Country-supporter row with both `country` and `player` relations included. */
export const CountrySupporterWithPlayerDataSchema = CountrySupporterDataSchema.extend({
    player: PlayerSchema,
});

/** Country-supporter entry enriched with both country and player data. */
export type CountrySupporterWithPlayerDataType = z.infer<typeof CountrySupporterWithPlayerDataSchema>;
