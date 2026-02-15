import { createMoreGameDays } from '@/actions/createMoreGameDays';
import { MoreGamesForm } from '@/components/MoreGamesForm/MoreGamesForm';
import { config } from '@/lib/config';
import gameDayService from '@/services/GameDay';

const toIsoDate = (date: Date) => date.toISOString().split('T')[0];

/**
 * Adds a specified number of days to a given date.
 *
 * @param date - The base date to add days to
 * @param days - The number of days to add (can be negative to subtract days)
 * @returns A new Date object with the specified number of days added
 *
 * @example
 * ```ts
 * const today = new Date('2024-01-01');
 * const nextWeek = addDays(today, 7); // 2024-01-08
 * const lastWeek = addDays(today, -7); // 2023-12-25
 * ```
 */
const addDays = (date: Date, days: number) => {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
};

/**
 * Normalizes a date to 6:00 PM (18:00) on the same day.
 *
 * @param date - The date to normalize
 * @returns A new Date object set to 18:00:00.000 on the same day as the input date
 */
const normalizeGameDayTime = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 18, 0, 0, 0);
};

/**
 * Calculates the booking year end date based on the given date. The booking
 * year runs from August 1st to July 31st. If the date is in August or later
 * (month >= 7), returns July 31st of the following year at 18:00:00. Otherwise,
 * returns July 31st of the current year at 18:00:00.
 *
 * @param date - The date to calculate the booking year end from
 * @returns A Date object representing the end of the booking year (July 31st at
 * 18:00:00)
 */
const getBookingYearEnd = (date: Date) => {
    const year = date.getFullYear();
    const isAfterJuly = date.getMonth() >= 7;
    const endYear = isAfterJuly ? year + 1 : year;
    return new Date(endYear, 6, 31, 18, 0, 0, 0);
};

/**
 * Calculates the date of the next Tuesday from a given date. If the given date
 * is a Tuesday, returns the following Tuesday (7 days later).
 *
 * @param from - The reference date to calculate from
 * @returns A Date object representing the next Tuesday after the given date
 *
 * @example
 * ```ts
 * const nextTuesday = getNextTuesday(new Date('2024-01-15')); // Returns Tuesday, Jan 16
 * const fromTuesday = getNextTuesday(new Date('2024-01-16')); // Returns Tuesday, Jan 23
 * ```
 */
const getNextTuesday = (from: Date) => {
    const day = from.getDay();
    const daysUntilTuesday = (2 - day + 7) % 7;
    const candidate = addDays(from, daysUntilTuesday);
    return candidate <= from ? addDays(candidate, 7) : candidate;
};

/**
 * Builds an array of weekly game rows from a start date to the end of the
 * booking year.
 *
 * Each row represents a game scheduled 7 days apart, starting from the given
 * date and continuing until the booking year end date (inclusive).
 *
 * @param startDate - The date to begin scheduling games from
 * @returns An array of game row objects, each containing:
 *   - `date`: ISO format date string (YYYY-MM-DD)
 *   - `game`: Boolean flag set to true indicating a game is scheduled
 *   - `comment`: Empty string for additional notes
 */
const buildRows = (startDate: Date) => {
    const endDate = getBookingYearEnd(startDate);
    const rows = [];

    for (let date = new Date(startDate); date <= endDate; date = addDays(date, 7)) {
        rows.push({
            date: toIsoDate(date),
            game: true,
            comment: '',
        });
    }

    return rows;
};

type PageProps = object;

const Page: React.FC<PageProps> = async () => {
    const lastGameDay = await gameDayService.getLatest();

    const startDate = lastGameDay ?
        addDays(normalizeGameDayTime(lastGameDay.date), 7) :
        normalizeGameDayTime(getNextTuesday(new Date()));
    const rows = buildRows(startDate);
    const cost = lastGameDay?.cost ?? config.defaultGameCostPence;

    return (
        <MoreGamesForm
            cost={cost}
            rows={rows}
            onCreateMoreGameDays={createMoreGameDays}
        />
    );
};

export default Page;
