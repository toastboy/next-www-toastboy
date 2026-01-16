import { z } from 'zod';

const GameDayRowSchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in ISO 8601 format (YYYY-MM-DD).'),
    game: z.boolean(),
    comment: z.string().optional(),
});

export const CreateMoreGameDaysSchema = z.object({
    rows: z.array(GameDayRowSchema).min(1, 'At least one game day is required.'),
});

export type CreateMoreGameDaysInput = z.infer<typeof CreateMoreGameDaysSchema>;
export type GameDayRowInput = z.infer<typeof GameDayRowSchema>;
