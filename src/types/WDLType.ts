import { z } from 'zod';

export const WDLSchema = z.object({
    won: z.number(),
    drawn: z.number(),
    lost: z.number(),
});

export type WDLType = z.infer<typeof WDLSchema>;
