import { PlayerSchema } from 'prisma/generated/schemas';
import { z } from 'zod';

export const PlayerDataSchema = PlayerSchema.extend({
    firstResponded: z.number().nullable(),
    lastResponded: z.number().nullable(),
    firstPlayed: z.number().nullable(),
    lastPlayed: z.number().nullable(),
    gamesPlayed: z.number(),
    gamesWon: z.number(),
    gamesDrawn: z.number(),
    gamesLost: z.number(),
});

export type PlayerDataType = z.infer<typeof PlayerDataSchema>;
