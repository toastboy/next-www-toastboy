'use server';

import { SendMailOptions } from 'nodemailer';

import { requireAdmin } from '@/lib/auth.server';
import { sendEmailToAllActivePlayersCore } from '@/lib/actions/sendEmailToAllActivePlayers';

/**
 * Sends an email to all active players.
 *
 * @param mailOptions - The email options (excluding `bcc`, which is populated
 * automatically from the active player list).
 * @returns A summary containing the recipient count.
 * @throws {AuthError} When the user is not an admin.
 */
export async function sendEmailToAllActivePlayers(
    mailOptions: Omit<SendMailOptions, 'bcc'>,
) {
    await requireAdmin();

    return sendEmailToAllActivePlayersCore(mailOptions);
}
