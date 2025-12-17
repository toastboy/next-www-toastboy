import { z } from 'zod';

import { PlayerRecordSchema, PlayerSchema } from '@/generated/zod/schemas';

export const PlayerRecordDataSchema = PlayerRecordSchema.extend({
    player: PlayerSchema,
});

export type PlayerRecordDataType = z.infer<typeof PlayerRecordDataSchema>;
