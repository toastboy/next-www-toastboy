import { PlayerResponseSchema } from 'prisma/zod/schemas';
import { z } from 'zod';

export const InvitationResponseInputSchema = z.object({
    token: z.string().min(1),
    response: PlayerResponseSchema,
    goalie: z.boolean(),
    comment: z.string().max(127).optional().nullable(),
});

export type InvitationResponseInput = z.infer<typeof InvitationResponseInputSchema>;
