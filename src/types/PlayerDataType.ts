import { PlayerSchema } from 'prisma/zod/schemas';
import { PlayerExtraEmailSchema } from 'prisma/zod/schemas/models/PlayerExtraEmail.schema';
import { z } from 'zod';

export const PlayerDataSchema = PlayerSchema.extend({
    accountEmail: z.email().nullable(),
    extraEmails: z.array(PlayerExtraEmailSchema),
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
