import { TeamNameSchema } from 'prisma/generated/schemas';
import { z } from 'zod';

export const TurnoutSchema = z.object({
    responses: z.number(),
    players: z.number(),
    cancelled: z.boolean(),
    id: z.number(),
    year: z.number(),
    date: z.date(),
    game: z.boolean(),
    mailSent: z.date().nullable(),
    comment: z.string().nullable(),
    bibs: TeamNameSchema.nullable(),
    pickerGamesHistory: z.number().nullable(),
    yes: z.number(),
    no: z.number(),
    dunno: z.number(),
    excused: z.number(),
    flaked: z.number(),
    injured: z.number(),
});

export type Turnout = z.infer<typeof TurnoutSchema>;
