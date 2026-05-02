import type { PlayerRecordSchema, PlayerSchema } from 'prisma/zod/schemas';
import type { z } from 'zod';

export type PlayerRecordDataType = z.infer<typeof PlayerRecordSchema> & {
    player: z.infer<typeof PlayerSchema>;
};
