import { OutcomeSchema, PlayerSchema } from 'prisma/generated/schemas';
import { z } from 'zod';

import { PlayerFormSchema } from './PlayerFormType';

export const TeamPlayerSchema = PlayerSchema.extend({
    outcome: OutcomeSchema,
    form: z.array(PlayerFormSchema),
});

export type TeamPlayerType = z.infer<typeof TeamPlayerSchema>;
