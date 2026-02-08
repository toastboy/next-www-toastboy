import type { SendMailOptions } from 'nodemailer';

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
    mailOptions: Omit<SendMailOptions, 'bcc'>,
) => Promise<SendEmailToAllActivePlayersResult>;
