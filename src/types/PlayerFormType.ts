import { GameDaySchema, OutcomeSchema } from 'prisma/zod/schemas';
import { z } from 'zod';

export const PlayerFormSchema = OutcomeSchema.extend({
    gameDay: GameDaySchema,
});

export type PlayerFormType = z.infer<typeof PlayerFormSchema>;
