import { z } from 'zod';

import { OutcomeSchema, PlayerSchema } from '@/generated/zod/schemas';

import { PlayerFormSchema } from './PlayerFormType';

export const TeamPlayerSchema = PlayerSchema.extend({
    outcome: OutcomeSchema,
    form: z.array(PlayerFormSchema),
});

export type TeamPlayerType = z.infer<typeof TeamPlayerSchema>;
