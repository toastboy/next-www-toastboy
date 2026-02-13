import type { GameDayType } from 'prisma/zod/schemas/models/GameDay.schema';
import { z } from 'zod';

export const SetGameEnabledInputSchema = z.object({
    gameDayId: z.number().int().min(1),
    game: z.boolean(),
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

export type SetGameEnabledInput = z.infer<typeof SetGameEnabledInputSchema>;

/**
 * Server action proxy type for the setGameEnabled action. Enables dependency
 * injection for components and stories without importing the server-only action
 * directly.
 *
 * Marks a game day as cancelled or reinstated and stores an optional reason.
 *
 * @param data - Validated input containing game day ID, game enabled status,
 * and optional reason.
 * @returns A promise that resolves to the updated game day.
 */
export type SetGameEnabledProxy = (
    data: SetGameEnabledInput,
) => Promise<GameDayType>;
