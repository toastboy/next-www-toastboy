'use server';

import { sendEmailToAllActivePlayersCore } from '@/lib/actions/sendEmailToAllActivePlayers';
import { SendEmailToAllActivePlayersSchema } from '@/types/actions/SendEmailToAllActivePlayers';

/**
 * Sends an email to all active players.
 *
 * @param rawData - The raw input data to validate and use for the email.
 * @returns A summary containing the recipient count.
 */
export async function sendEmailToAllActivePlayers(rawData: unknown) {
    const data = SendEmailToAllActivePlayersSchema.parse(rawData);
    return sendEmailToAllActivePlayersCore(data);
}
