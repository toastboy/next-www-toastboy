import type { GameDayType } from 'prisma/zod/schemas/models/GameDay.schema';
import { z } from 'zod';

export const CancelGameInputSchema = z.object({
    gameDayId: z.number().int().min(1),
    reason: z.preprocess(
        (val) => {
            if (typeof val !== 'string') {
                return val;
            }

            const trimmed = val.trim();
            return trimmed === '' ? null : trimmed;
        },
        z.string().max(255).nullable(),
    ),
});

export type CancelGameInput = z.infer<typeof CancelGameInputSchema>;

/**
 * Server action proxy type for the cancelGame action.
 * Enables dependency injection for components and stories without importing
 * the server-only action directly.
 *
 * Marks a game day as cancelled and stores an optional cancellation reason.
 *
 * @param data - Validated cancellation input containing game day ID and optional reason.
 * @returns A promise that resolves to the updated game day.
 */
export type CancelGameProxy = (
    data: CancelGameInput,
) => Promise<GameDayType>;
