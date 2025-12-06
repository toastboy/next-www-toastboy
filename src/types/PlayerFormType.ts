import { GameDaySchema, OutcomeSchema } from 'prisma/generated/schemas';
import { z } from 'zod';

export const PlayerFormSchema = OutcomeSchema.extend({
    gameDay: GameDaySchema,
});

export type PlayerFormType = z.infer<typeof PlayerFormSchema>;
