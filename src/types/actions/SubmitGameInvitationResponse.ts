import { OutcomeType } from 'prisma/zod/schemas/models/Outcome.schema';

import type { InvitationResponseInput } from '@/types/InvitationResponseInput';

/**
 * Server action proxy type for the submitGameInvitationResponse action.
 * Enables dependency injection for components and stories without importing
 * the server-only action directly.
 *
 * Validates the game invitation response data and persists the player's
 * response (Yes/No/Dunno), goalie status, and optional comment to the database.
 *
 * @param data - Validated invitation response input including token, response choice, goalie flag, and optional comment.
 * @returns A promise that resolves to the upserted Outcome record, or null if the upsert failed.
 */
export type SubmitGameInvitationResponseProxy = (
    data: InvitationResponseInput,
) => Promise<OutcomeType | null>;
