import { PlayerRecordSchema, PlayerSchema } from 'prisma/generated/schemas';
import { z } from 'zod';

export const PlayerRecordDataSchema = PlayerRecordSchema.extend({
    player: PlayerSchema,
});

export type PlayerRecordDataType = z.infer<typeof PlayerRecordDataSchema>;
