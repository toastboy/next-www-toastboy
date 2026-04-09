import 'server-only';

import debug from 'debug';

/**
 * Re-export pure date utilities so server-side consumers can continue to
 * import everything from `@/lib/dates`.
 */
export {
    formatDate,
    getFullMonthName,
    getOrdinal,
    getShortMonthName,
} from './dates';

const log = debug('footy:dates');

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
export async function getBankHolidays(): Promise<Set<string>> {
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
 * Snapshot of the module-level bank holiday cache state.
 *
 * Exported for testing only so unit tests can verify whether a successful fetch
 * updated both the cached date set and its associated timestamp, without
 * mutating the internal cache by reference.
 */
export interface BankHolidaysCacheState {
    /**
     * Cached bank holiday date keys, or `null` when no cache has been populated.
     */
    cache: Set<string> | null;
    /**
     * Epoch milliseconds representing when the cache was last refreshed.
     */
    cacheTime: number;
}

/**
 * Returns a defensive snapshot of the current bank holiday cache state.
 *
 * Exported for testing only so the `getBankHolidays` test suite can assert
 * cache and timestamp updates without depending on untyped module internals.
 *
 * @returns A snapshot containing a cloned cached set, if present, and the
 * current cache timestamp.
 */
export function getBankHolidaysCacheState(): BankHolidaysCacheState {
    return {
        cache: bankHolidaysCache ? new Set(bankHolidaysCache) : null,
        cacheTime: bankHolidaysCacheTime,
    };
}

/**
 * Primes the module-level bank holiday cache with known values.
 *
 * Exported for testing only so unit tests can deterministically exercise cache
 * hit and failed-fetch fallback behaviour without making a real network
 * request.
 *
 * @param dates - Date keys to store in the cache.
 * @param cacheTime - Epoch milliseconds to associate with the primed cache.
 */
export function primeBankHolidaysCacheForTesting(
    dates: Iterable<string>,
    cacheTime: number = Date.now(),
): void {
    bankHolidaysCache = new Set(dates);
    bankHolidaysCacheTime = cacheTime;
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
export const isWorkingDay = (date: Date, bankHolidays: Set<string>) => {
    const day = date.getDay();
    if (day === 0 || day === 6) return false;
    return !bankHolidays.has(formatDateKey(date));
};
