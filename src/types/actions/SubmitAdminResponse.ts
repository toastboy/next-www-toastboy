import { PlayerResponseSchema } from 'prisma/zod/schemas';
import { OutcomeType } from 'prisma/zod/schemas/models/Outcome.schema';
import { z } from 'zod';

export const AdminResponseInputSchema = z.object({
    gameDayId: z.number().min(1),
    playerId: z.number().min(1),
    response: PlayerResponseSchema,
    goalie: z.boolean(),
    comment: z.string().max(127).optional().nullable(),
});

export type AdminResponseInput = z.infer<typeof AdminResponseInputSchema>;

/**
 * Server action proxy type for the submitAdminResponse action. Enables
 * dependency injection for components and stories without importing the
 * server-only action directly.
 *
 * Validates the game admin response data and persists the player's response
 * (Yes/No/Dunno), goalie status, and optional comment to the database.
 *
 * @param data - Validated admin response input including player ID, response
 * choice, goalie flag, and optional comment.
 * @returns A promise that resolves to the upserted Outcome record, or null if
 * the upsert failed.
 */
export type SubmitAdminResponseProxy = (
    data: AdminResponseInput,
) => Promise<OutcomeType | null>;
