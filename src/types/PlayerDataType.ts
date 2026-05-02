import type { PlayerExtraEmailSchema, PlayerSchema } from 'prisma/zod/schemas';
import type { z } from 'zod';

export type PlayerDataType = z.infer<typeof PlayerSchema> & {
    accountEmail: string | null;
    extraEmails: z.infer<typeof PlayerExtraEmailSchema>[];
    firstResponded: number | null;
    lastResponded: number | null;
    firstPlayed: number | null;
    lastPlayed: number | null;
    gamesPlayed: number;
    gamesWon: number;
    gamesDrawn: number;
    gamesLost: number;
};
