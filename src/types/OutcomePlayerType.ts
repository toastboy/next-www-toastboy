import { OutcomeSchema, PlayerSchema } from 'prisma/zod/schemas';
import type z from 'zod';

import { PointsSchema } from '@/types/Points';

export const OutcomePlayerType = OutcomeSchema.extend({
    points: PointsSchema.nullable(),
    player: PlayerSchema,
});

export type OutcomePlayerType = z.infer<typeof OutcomePlayerType>;
