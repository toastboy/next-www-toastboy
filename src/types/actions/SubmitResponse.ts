import { PlayerResponseSchema } from 'prisma/zod/schemas';
import { OutcomeType } from 'prisma/zod/schemas/models/Outcome.schema';
import { z } from 'zod';

export const SubmitResponseInputSchema = z.object({
    gameDayId: z.number().min(1),
    playerId: z.number().min(1),
    response: PlayerResponseSchema,
    goalie: z.boolean(),
    comment: z.string().max(127).optional().nullable(),
});

export type SubmitResponseInput = z.infer<typeof SubmitResponseInputSchema>;

/**
 * Server action proxy type for the SubmitResponse action. Enables
 * dependency injection for components and stories without importing the
 * server-only action directly.
 *
 * Validates response data and persists the player's response
 * (Yes/No/Dunno), goalie status, and optional comment to the database.
 *
 * @param data - Validated response input including player ID, response
 * choice, goalie flag, and optional comment.
 * @returns A promise that resolves to the upserted Outcome record, or null if
 * the upsert failed.
 */
export type SubmitResponseProxy = (
    data: SubmitResponseInput,
) => Promise<OutcomeType | null>;
