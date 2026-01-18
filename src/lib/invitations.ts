import 'server-only';

import gameDayService from '@/services/GameDay';

/**
 * Represents the decision outcome for sending a game invitation.
 *
 * @interface InvitationDecision
 * @property {('ready' | 'skipped')} status - The current status of the
 * invitation decision.
 * @property {('ready' | 'no-upcoming-game' | 'already-sent' | 'too-early')}
 * reason - The reason for the current status.
 * @property {number} [gameDayId] - Optional identifier for the game day.
 * @property {Date} [gameDate] - Optional date when the game is scheduled.
 * @property {Date} [mailDate] - Optional date when the invitation email should
 * be sent.
 * @property {boolean} overrideTimeCheck - Flag indicating whether to bypass
 * time-based sending restrictions.
 * @property {(string | null)} [customMessage] - Optional custom message to
 * include in the invitation.
 */
export interface InvitationDecision {
    status: 'ready' | 'skipped';
    reason: 'ready' | 'no-upcoming-game' | 'already-sent' | 'too-early';
    gameDayId?: number;
    gameDate?: Date;
    mailDate?: Date;
    overrideTimeCheck: boolean;
    customMessage?: string | null;
}

/**
 * Determines if a given date falls on a working day (Monday-Friday).
 *
 * @param date - The date to check
 * @returns `true` if the date is a weekday (Monday-Friday), `false` if it's a
 * weekend (Saturday-Sunday)
 *
 * @example
 * ```ts
 * const monday = new Date('2024-01-15'); // Monday
 * isWorkingDay(monday); // true
 *
 * const saturday = new Date('2024-01-13'); // Saturday
 * isWorkingDay(saturday); // false
 * ```
 */
const isWorkingDay = (date: Date) => {
    // TODO: consider bank holidays
    const day = date.getDay();
    return day !== 0 && day !== 6;
};

/**
 * Calculates the mail date for a game invitation, which is set to 9:00 AM on
 * the previous working day.
 *
 * @param gameDate - The date of the game for which to calculate the mail date
 * @returns A Date object set to 9:00 AM on the last working day before the game
 * date
 *
 * @remarks
 * The function will keep moving backwards one day at a time until it finds a
 * working day. A working day is determined by the `isWorkingDay` helper
 * function.
 */
const getMailDate = (gameDate: Date) => {
    const mailDate = new Date(gameDate);
    mailDate.setHours(9, 0, 0, 0);
    mailDate.setDate(mailDate.getDate() - 1);

    while (!isWorkingDay(mailDate)) {
        mailDate.setDate(mailDate.getDate() - 1);
    }

    return mailDate;
};

/**
 * Determines whether an invitation email should be sent for an upcoming game.
 *
 * This function checks if there is an upcoming game, whether an invitation has
 * already been sent, and whether the current time has reached the scheduled
 * mail date (unless overridden).
 *
 * @param options - Configuration options for the invitation decision
 * @param options.overrideTimeCheck - If true, bypasses the mail date check and
 * marks the invitation as ready to send
 * @param options.customMessage - Optional custom message to include with the
 * invitation
 *
 * @returns A promise that resolves to an InvitationDecision object containing:
 * - `status`: Either 'ready' (should send) or 'skipped' (should not send)
 * - `reason`: The reason for the decision ('no-upcoming-game', 'already-sent',
 *   'too-early', or 'ready')
 * - `gameDayId`: The ID of the game day (if applicable)
 * - `gameDate`: The date of the game (if applicable)
 * - `mailDate`: The calculated mail send date (if applicable)
 * - `overrideTimeCheck`: Echo of the input parameter
 * - `customMessage`: Echo of the input parameter
 *
 * @example
 * ```typescript
 * const decision = await getInvitationDecision({ overrideTimeCheck: false });
 * if (decision.status === 'ready') {
 *   // Send invitation email
 * }
 * ```
 */
export async function getInvitationDecision({
    overrideTimeCheck,
    customMessage,
}: {
    overrideTimeCheck: boolean;
    customMessage?: string | null;
}): Promise<InvitationDecision> {
    const upcomingGame = await gameDayService.getUpcoming();

    if (!upcomingGame) {
        return {
            status: 'skipped',
            reason: 'no-upcoming-game',
            overrideTimeCheck,
            customMessage,
        };
    }

    if (upcomingGame.mailSent) {
        return {
            status: 'skipped',
            reason: 'already-sent',
            gameDayId: upcomingGame.id,
            gameDate: upcomingGame.date,
            overrideTimeCheck,
            customMessage,
        };
    }

    const mailDate = getMailDate(upcomingGame.date);
    const shouldSend = overrideTimeCheck || new Date() >= mailDate;

    return {
        status: shouldSend ? 'ready' : 'skipped',
        reason: shouldSend ? 'ready' : 'too-early',
        gameDayId: upcomingGame.id,
        gameDate: upcomingGame.date,
        mailDate,
        overrideTimeCheck,
        customMessage,
    };
}
