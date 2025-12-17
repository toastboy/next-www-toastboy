import { z } from 'zod';

import { GameDaySchema, OutcomeSchema } from '@/generated/zod/schemas';

export const PlayerFormSchema = OutcomeSchema.extend({
    gameDay: GameDaySchema,
});

export type PlayerFormType = z.infer<typeof PlayerFormSchema>;
