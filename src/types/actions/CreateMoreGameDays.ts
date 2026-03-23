import type { GameDayType } from 'prisma/zod/schemas/models/GameDay.schema';
import { z } from 'zod';

import { fromPounds } from '@/lib/money';


const GameDayRowSchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in ISO 8601 format (YYYY-MM-DD).'),
    game: z.boolean(),
    comment: z.string().optional(),
});
const PoundsSchema = z.number()
    .positive('Cost must be a positive number.')
    .refine((value) => Number.isInteger(fromPounds(value)), {
        message: 'Cost must have at most 2 decimal places.',
    });

export const CreateMoreGameDaysSchema = z.object({
    cost: PoundsSchema,
    hallCost: PoundsSchema,
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
