import 'server-only';

import type { SendMailOptions } from 'nodemailer';

import { sendEmailCore } from '@/lib/core/sendEmail';
import { normalizeEmail } from '@/lib/email/normalizeEmail';
import playerService from '@/services/Player';
import type { SendEmailProxy } from '@/types/actions/SendEmail';
import type {
    SendEmailToAllActivePlayersResult,
} from '@/types/actions/SendEmailToAllActivePlayers';

interface SendEmailToAllActivePlayersDeps {
    playerService: Pick<typeof playerService, 'getAll'>;
    sendEmail: SendEmailProxy;
}

const defaultDeps: SendEmailToAllActivePlayersDeps = {
    playerService,
    sendEmail: sendEmailCore,
};

/**
 * Sends one email to all active players with de-duplicated recipients.
 *
 * Active players are those without a `finished` timestamp.
 * Recipients are built from account and extra email addresses.
 *
 * @param data - Email content payload.
 * @param deps - Optional service and email dependencies.
 * @returns The number of unique recipients emailed.
 */
export async function sendEmailToAllActivePlayersCore(
    mailOptions: Omit<SendMailOptions, 'bcc'>,
    deps: SendEmailToAllActivePlayersDeps = defaultDeps,
): Promise<SendEmailToAllActivePlayersResult> {
    const players = await deps.playerService.getAll({ activeOnly: true });

    const recipients = new Set<string>();
    for (const player of players) {
        if (player.accountEmail) {
            const normalizedEmail = normalizeEmail(player.accountEmail);
            if (normalizedEmail) recipients.add(normalizedEmail);
        }

        for (const extraEmail of player.extraEmails) {
            if (extraEmail.verified) {
                const normalizedEmail = normalizeEmail(extraEmail.email);
                if (normalizedEmail) recipients.add(normalizedEmail);
            }
        }
    }

    if (recipients.size === 0) {
        return { recipientCount: 0 };
    }

    const sortedRecipients = Array.from(recipients).sort();
    await deps.sendEmail({
        ...mailOptions,
        bcc: sortedRecipients.join(','),
    });
    return { recipientCount: recipients.size };
}
