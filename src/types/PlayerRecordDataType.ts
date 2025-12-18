import { PlayerRecordSchema, PlayerSchema } from 'prisma/zod/schemas';
import { z } from 'zod';

export const PlayerRecordDataSchema = PlayerRecordSchema.extend({
    player: PlayerSchema,
});

export type PlayerRecordDataType = z.infer<typeof PlayerRecordDataSchema>;
