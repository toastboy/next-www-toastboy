import { GameDaySchema, OutcomeSchema } from 'prisma/zod/schemas';
import type z from 'zod';

import { PointsSchema } from '@/types/Points';

export const PlayerFormSchema = OutcomeSchema.extend({
    points: PointsSchema.nullable(),
    gameDay: GameDaySchema.optional(),
});

export type PlayerFormType = z.infer<typeof PlayerFormSchema>;
