import { z } from 'zod';

export const NewGameInputSchema = z.object({
    overrideTimeCheck: z.boolean(),
    customMessage: z.string().max(5000).optional(),
});

export type NewGameInput = z.infer<typeof NewGameInputSchema>;
