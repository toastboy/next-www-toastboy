import { z } from 'zod';

/**
 * Schema describing the payload for sending an email to all active players.
 */
export const SendEmailToAllActivePlayersSchema = z.object({
    cc: z.string().trim().default(''),
    subject: z.string().trim().min(1, { message: 'Subject is required' }),
    html: z.string().trim().min(1, { message: 'Body cannot be empty' }),
});

/**
 * Input type inferred from the sendEmailToAllActivePlayers schema.
 */
export type SendEmailToAllActivePlayersInput = z.infer<typeof SendEmailToAllActivePlayersSchema>;

/**
 * Result payload for sendEmailToAllActivePlayers action/core.
 */
export interface SendEmailToAllActivePlayersResult {
    recipientCount: number;
}

/**
 * Server action proxy type for sending an email to all active players.
 */
export type SendEmailToAllActivePlayersProxy = (
    data: SendEmailToAllActivePlayersInput,
) => Promise<SendEmailToAllActivePlayersResult>;
