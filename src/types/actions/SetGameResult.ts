import type { TeamName } from 'prisma/zod/schemas';
import { TeamNameSchema } from 'prisma/zod/schemas/enums/TeamName.schema';
import type { GameDayType } from 'prisma/zod/schemas/models/GameDay.schema';
import { z } from 'zod';

export const SetGameResultInputSchema = z.object({
    gameDayId: z.number().int().min(1),
    bibs: TeamNameSchema.nullable(),
    winner: z.union([TeamNameSchema, z.literal('draw')]).nullable(),
});

export type SetGameWinner = TeamName | 'draw' | null;
export type SetGameResultInput = z.infer<typeof SetGameResultInputSchema>;

/**
 * Proxy function type for setting game results.
 *
 * @param data - The input data containing game result information
 * @returns A promise that resolves to the updated game day data
 */
export type SetGameResultProxy = (
    data: SetGameResultInput,
) => Promise<GameDayType>;
