import type { GameDayType } from 'prisma/zod/schemas/models/GameDay.schema';
import { z } from 'zod';

const GameDayRowSchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in ISO 8601 format (YYYY-MM-DD).'),
    game: z.boolean(),
    comment: z.string().optional(),
});

export const CreateMoreGameDaysSchema = z.object({
    cost: z.number().int().min(1, 'Cost must be at least 1 penny.'),
    rows: z.array(GameDayRowSchema).min(1, 'At least one game day is required.'),
});

export type CreateMoreGameDaysInput = z.infer<typeof CreateMoreGameDaysSchema>;
export type GameDayRowInput = z.infer<typeof GameDayRowSchema>;

/**
 * Server action proxy type for the createMoreGameDays action.
 * Enables dependency injection for components and stories without importing
 * the server-only action directly.
 *
 * Creates multiple game day entries and revalidates related paths in the cache.
 *
 * @param data - Validated input containing rows of game day information to create.
 * @returns A promise that resolves to an array of created GameDay records, or null if
 * any creation failed.
 */
export type CreateMoreGameDaysProxy = (
    data: CreateMoreGameDaysInput,
) => Promise<(GameDayType | null)[]>;
