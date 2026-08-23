import { GameDaySchema } from 'prisma/zod/schemas/models/GameDay.schema';
import { PlayerRecordSchema } from 'prisma/zod/schemas/models/PlayerRecord.schema';
import type z from 'zod';

// Deliberately not re-exported from '@/types' (unlike every other type file
// in this directory) — re-exporting it from the barrel puts it in the same
// module graph as everything else importing '@/types', which triggered a
// Turbopack production-build crash ("Cannot access ... before initialization")
// via an unrelated circular-import chain through the generated Prisma Zod
// schema barrel. Import from this file directly instead.
export const PlayerLastResultSchema = PlayerRecordSchema.extend({
    gameDay: GameDaySchema,
});

export type PlayerLastResultType = z.infer<typeof PlayerLastResultSchema>;
