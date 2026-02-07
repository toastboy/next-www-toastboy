import 'server-only';

import { sendEmailCore } from '@/lib/actions/sendEmail';
import playerService from '@/services/Player';
import type { SendEmailProxy } from '@/types/actions/SendEmail';
import type {
    SendEmailToAllActivePlayersInput,
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
 * Normalises an email address by trimming whitespace and converting to lower case.
 *
 * Accepts `string`, `null`, or `undefined` and returns an empty string when the
 * input is not provided. This helper does not validate that the result is a
 * syntactically valid email address.
 *
 * @param email - The email address to normalise.
 * @returns The normalised email address, or an empty string when not provided.
 */
const normalizeEmail = (email?: string | null) => (email ?? '').trim().toLowerCase();

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
    data: SendEmailToAllActivePlayersInput,
    deps: SendEmailToAllActivePlayersDeps = defaultDeps,
): Promise<SendEmailToAllActivePlayersResult> {
    const players = await deps.playerService.getAll({ activeOnly: true });

    const recipients = new Set<string>();
    for (const player of players) {
        if (player.accountEmail) {
            const normalizedEmail = normalizeEmail(player.accountEmail);
            if (normalizedEmail.length > 0) {
                recipients.add(normalizedEmail);
            }
        }

        for (const extraEmail of player.extraEmails) {
            if (extraEmail.verifiedAt) {
                const normalizedEmail = normalizeEmail(extraEmail.email);
                if (normalizedEmail.length > 0) {
                    recipients.add(normalizedEmail);
                }
            }
        }
    }

    if (recipients.size === 0) {
        return { recipientCount: 0 };
    }

    // TODO: Send bulk emails to bcc recipients instead of a single email with
    // all recipients in the "to" field.
    const sortedRecipients = Array.from(recipients).sort();
    await deps.sendEmail(sortedRecipients.join(','), data.cc, data.subject, data.html);
    return { recipientCount: recipients.size };
}
