'use server';

import { SendMailOptions } from 'nodemailer';

import { sendEmailToAllActivePlayersCore } from '@/lib/actions/sendEmailToAllActivePlayers';

/**
 * Sends an email to all active players.
 *
 * @param rawData - The raw input data to validate and use for the email.
 * @returns A summary containing the recipient count.
 */
export async function sendEmailToAllActivePlayers(
    mailOptions: Omit<SendMailOptions, 'bcc'>,
) {
    return sendEmailToAllActivePlayersCore(mailOptions);
}
