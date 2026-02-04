import { OutcomeSchema, PlayerSchema } from 'prisma/zod/schemas';
import { z } from 'zod';

export const OutcomePlayerType = OutcomeSchema.extend({
    player: PlayerSchema,
});

export type OutcomePlayerType = z.infer<typeof OutcomePlayerType>;
