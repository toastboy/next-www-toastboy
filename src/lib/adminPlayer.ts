import { PlayerDataType } from '@/types';

export type SortKey = 'id' | 'name' | 'joined' | 'finished' | 'auth' | 'extraEmails';
export type SortDirection = 'asc' | 'desc';

/**
 * Compares nullable numeric values with consistent null ordering.
 *
 * @param a - The left-hand numeric value.
 * @param b - The right-hand numeric value.
 * @param direction - Sort direction (`asc` or `desc`).
 * @returns A comparison value suitable for Array.sort.
 */
export function compareNullableNumber(
    a: number | null | undefined,
    b: number | null | undefined,
    direction: SortDirection,
) {
    if (a == null && b == null) return 0;
    if (a == null) return 1;
    if (b == null) return -1;
    return direction === 'asc' ? a - b : b - a;
}

/**
 * Compares nullable string values with locale-aware ordering.
 *
 * @param a - The left-hand string value.
 * @param b - The right-hand string value.
 * @param direction - Sort direction (`asc` or `desc`).
 * @returns A comparison value suitable for Array.sort.
 */
export function compareNullableString(
    a: string | null | undefined,
    b: string | null | undefined,
    direction: SortDirection,
) {
    if (a == null && b == null) return 0;
    if (a == null) return 1;
    if (b == null) return -1;
    const result = a.localeCompare(b);
    return direction === 'asc' ? result : -result;
}

/**
 * Normalizes email addresses for consistent comparisons.
 *
 * @param email - The email address to normalize.
 * @returns The normalized email, or an empty string when missing.
 */
export function normalizeEmail(email?: string | null) {
    return (email ?? '').trim().toLowerCase();
}

/**
 * Determines whether a player has a Better Auth user account.
 *
 * @param player - The player to check.
 * @param userEmailSet - Known Better Auth user emails (lowercased).
 * @returns True when the player's accountEmail exists in Better Auth.
 */
export function isOnboarded(player: PlayerDataType, userEmailSet: Set<string>) {
    const email = normalizeEmail(player.accountEmail);
    return email.length > 0 && userEmailSet.has(email);
}

/**
 * Applies the current sort key to two players.
 *
 * @param a - The left-hand player.
 * @param b - The right-hand player.
 * @param key - The player field to compare.
 * @param direction - Sort direction (`asc` or `desc`).
 * @param userEmailSet - Known Better Auth user emails (lowercased).
 * @returns A comparison value suitable for Array.sort.
 */
export function comparePlayers(
    a: PlayerDataType,
    b: PlayerDataType,
    key: SortKey,
    direction: SortDirection,
    userEmailSet: Set<string>,
) {
    switch (key) {
        case 'id':
            return compareNullableNumber(a.id, b.id, direction);
        case 'name':
            return compareNullableString(a.name, b.name, direction);
        case 'joined':
            return compareNullableNumber(
                a.joined ? new Date(a.joined).getTime() : null,
                b.joined ? new Date(b.joined).getTime() : null,
                direction,
            );
        case 'finished':
            return compareNullableNumber(
                a.finished ? new Date(a.finished).getTime() : null,
                b.finished ? new Date(b.finished).getTime() : null,
                direction,
            );
        case 'auth':
            return compareNullableNumber(
                isOnboarded(a, userEmailSet) ? 1 : 0,
                isOnboarded(b, userEmailSet) ? 1 : 0,
                direction,
            );
        case 'extraEmails':
            return compareNullableNumber(
                a.extraEmails.length > 0 ? (a.extraEmails.every((email) => email.verifiedAt) ? 1 : 0) : null,
                b.extraEmails.length > 0 ? (b.extraEmails.every((email) => email.verifiedAt) ? 1 : 0) : null,
                direction,
            );
        default:
            return 0;
    }
}

/**
 * Chooses the best email for a player, preferring accountEmail then verified extras.
 *
 * @param player - The player to derive the preferred email from.
 * @returns The preferred email or an empty string if none is available.
 */
export function getPreferredEmail(player: PlayerDataType) {
    if (player.accountEmail) {
        return player.accountEmail;
    }
    if (!player.extraEmails.length) return '';
    const verifiedEmail = player.extraEmails.find((playerEmail) => playerEmail.verifiedAt);
    return (verifiedEmail ?? player.extraEmails[0])?.email ?? '';
}

/**
 * Chooses the display label for impersonation status notifications.
 *
 * @param player - The player being impersonated.
 * @returns The player name, account email, or a generic fallback label.
 */
export function getImpersonationLabel(player: PlayerDataType) {
    return player.name ?? player.accountEmail ?? 'player';
}

/**
 * Builds the HTML for the onboarding invite email.
 *
 * @param inviteLink - The invite link for claim signup.
 * @returns Sanitizable HTML content for the invitation email body.
 */
export function buildInviteEmail(inviteLink: string) {
    return [
        '<div style="font-family:Arial,Helvetica,sans-serif;line-height:1.5;">',
        `<p>Welcome to Toastboy FC!</p>`,
        `<p>Follow this link to get started: <a href="${inviteLink}">confirm your account</a></p>`,
        `<p>We look forward to seeing you on the pitch! `,
        `The games are every Tuesday at 18:00 at Kelsey Kerridge in Cambridge. `,
        `Please arrive a bit early so you've got time to park and pay `,
        `the day membership.</p>`,
        `<p>All the details are here: <a href="https://www.toastboy.co.uk/footy/info">Toastboy FC info page</a></p>`,
        `<p>Cheers,<br />Jon</p>`,
        `</div>`,
    ].join('');
}
