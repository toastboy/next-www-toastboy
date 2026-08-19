import { OutcomeSchema, PlayerSchema } from 'prisma/zod/schemas';
import z from 'zod';

import { PointsSchema } from '@/types/Points';

import { PlayerFormSchema } from './PlayerFormType';

export const TeamPlayerSchema = PlayerSchema.extend({
    outcome: OutcomeSchema.extend({ points: PointsSchema.nullable() }),
    form: z.array(PlayerFormSchema),
});

export type TeamPlayerType = z.infer<typeof TeamPlayerSchema>;
