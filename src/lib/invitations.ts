import 'server-only';

import debug from 'debug';

import gameDayService from '@/services/GameDay';

const log = debug('footy:invitations');

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
}

/** URL for the UK Government Bank Holidays API. */
const BANK_HOLIDAYS_API_URL = 'https://www.gov.uk/bank-holidays.json';

/** Cache duration for bank holiday data (24 hours). */
const BANK_HOLIDAYS_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

/** Cached bank holiday date strings in YYYY-MM-DD format. */
let bankHolidaysCache: Set<string> | null = null;

/** Timestamp when the cache was last populated. */
let bankHolidaysCacheTime = 0;

/**
 * Shape of a single bank holiday event from the UK Government API.
 */
interface BankHolidayEvent {
    title: string;
    date: string;
    notes: string;
    bunting: boolean;
}

/**
 * Response shape from the UK Government Bank Holidays API.
 */
interface BankHolidaysResponse {
    'england-and-wales': {
        division: string;
        events: BankHolidayEvent[];
    };
}

/**
 * Formats a Date as a YYYY-MM-DD string for comparison with bank holiday API
 * dates.
 *
 * @param date - The date to format
 * @returns Date string in YYYY-MM-DD format
 */
const formatDateKey = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * Fetches England and Wales bank holiday dates from the UK Government API,
 * with a 24-hour in-memory cache to avoid repeated requests.
 *
 * @see https://www.api.gov.uk/gds/bank-holidays/#bank-holidays
 * @returns A Set of date strings in YYYY-MM-DD format representing bank
 * holidays. Falls back to cached data or an empty set on failure.
 */
async function getBankHolidays(): Promise<Set<string>> {
    const now = Date.now();
    if (bankHolidaysCache && (now - bankHolidaysCacheTime) < BANK_HOLIDAYS_CACHE_TTL_MS) {
        return bankHolidaysCache;
    }

    try {
        const response = await fetch(BANK_HOLIDAYS_API_URL);
        if (!response.ok) {
            log('Failed to fetch bank holidays: %s %s', response.status, response.statusText);
            return bankHolidaysCache ?? new Set();
        }

        const data = await response.json() as BankHolidaysResponse;
        const dates = new Set(
            data['england-and-wales'].events.map((event) => event.date),
        );
        bankHolidaysCache = dates;
        bankHolidaysCacheTime = now;
        log('Fetched %d bank holidays', dates.size);
        return dates;
    } catch (error) {
        log('Error fetching bank holidays: %O', error);
        return bankHolidaysCache ?? new Set();
    }
}

/**
 * Resets the bank holidays cache. Exported for testing only.
 */
export function resetBankHolidaysCache(): void {
    bankHolidaysCache = null;
    bankHolidaysCacheTime = 0;
}

/**
 * Determines if a given date falls on a working day (not a weekend and not a
 * UK bank holiday).
 *
 * @param date - The date to check
 * @param bankHolidays - Set of bank holiday dates in YYYY-MM-DD format
 * @returns `true` if the date is a working day, `false` if it's a weekend or
 * bank holiday
 *
 * @example
 * ```ts
 * const bankHols = new Set(['2024-01-01']);
 * isWorkingDay(new Date('2024-01-15'), bankHols); // true (Monday)
 * isWorkingDay(new Date('2024-01-13'), bankHols); // false (Saturday)
 * isWorkingDay(new Date('2024-01-01'), bankHols); // false (bank holiday)
 * ```
 */
const isWorkingDay = (date: Date, bankHolidays: Set<string>) => {
    const day = date.getDay();
    if (day === 0 || day === 6) return false;
    return !bankHolidays.has(formatDateKey(date));
};

/**
 * Calculates the mail date for a game invitation, which is set to 9:00 AM on
 * the previous working day (excluding weekends and UK bank holidays).
 *
 * @param gameDate - The date of the game for which to calculate the mail date
 * @returns A Date object set to 9:00 AM on the last working day before the game
 * date
 *
 * @remarks
 * The function will keep moving backwards one day at a time until it finds a
 * working day. A working day is determined by the `isWorkingDay` helper
 * function, which excludes both weekends and UK bank holidays.
 */
const getMailDate = async (gameDate: Date): Promise<Date> => {
    const bankHolidays = await getBankHolidays();
    const mailDate = new Date(gameDate);
    mailDate.setHours(9, 0, 0, 0);
    mailDate.setDate(mailDate.getDate() - 1);

    while (!isWorkingDay(mailDate, bankHolidays)) {
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
export async function getInvitationDecision(override = false): Promise<InvitationDecision> {
    const upcomingGame = await gameDayService.getUpcoming();

    if (!upcomingGame) {
        return {
            status: 'skipped',
            reason: 'no-upcoming-game',
        };
    }

    if (upcomingGame.mailSent && !override) {
        return {
            status: 'skipped',
            reason: 'already-sent',
            gameDayId: upcomingGame.id,
            gameDate: upcomingGame.date,
        };
    }

    const mailDate = await getMailDate(upcomingGame.date);
    const shouldSend = override || new Date() >= mailDate;

    return {
        status: shouldSend ? 'ready' : 'skipped',
        reason: shouldSend ? 'ready' : 'too-early',
        gameDayId: upcomingGame.id,
        gameDate: upcomingGame.date,
        mailDate,
    };
}
