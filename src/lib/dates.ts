/**
 * `Intl.PluralRules` instance configured for British English ordinal
 * formatting.
 *
 * Use this to determine the ordinal plural category (for example, `one`, `two`,
 * `few`, `other`) for numeric values, which is useful when rendering suffixes
 * such as `st`, `nd`, `rd`, and `th`.
 */
const rules = new Intl.PluralRules("en-GB", { type: "ordinal" });

/**
 * Maps plural rule categories to English ordinal suffixes.
 *
 * Intended for use with ordinal pluralization logic (e.g., `Intl.PluralRules`
 * with `{ type: "ordinal" }`) where:
 * - `"one"` → `"st"` (1st)
 * - `"two"` → `"nd"` (2nd)
 * - `"few"` → `"rd"` (3rd)
 * - `"other"` → `"th"` (all other ordinals)
 */
const suffixes = new Map([
    ["one", "st"],
    ["two", "nd"],
    ["few", "rd"],
    ["other", "th"],
]);

/**
 * Converts a numeric day value into its ordinal string form (for example,
 * `1st`, `2nd`, `3rd`, `4th`).
 *
 * Uses locale-aware pluralization rules to determine the appropriate ordinal
 * category and maps that category to a suffix, defaulting to `"th"` when no
 * specific suffix is found.
 *
 * @param n - The number to format as an ordinal.
 * @returns The ordinal representation of the input number.
 */
export function getOrdinal(n: number): string {
    const rule = rules.select(n);
    const suffix = suffixes.get(rule);
    return `${n}${suffix ?? "th"}`;
}

/**
 * Formats a date value into an ISO date string (YYYY-MM-DD format).
 *
 * @param value - The date value to format. Can be a Date object, ISO string,
 * null, or undefined.
 * @returns A string in YYYY-MM-DD format, or '-' if the value is null or
 * undefined.
 *
 * @example
 * ```ts
 * formatDate(new Date('2023-12-25')) // Returns '2023-12-25'
 * formatDate('2023-12-25T10:30:00Z') // Returns '2023-12-25'
 * formatDate(null) // Returns '-'
 * ```
 */
export const formatDate = (value: Date | string | null | undefined) => {
    if (value == null) return '-';
    return new Date(value).toISOString().split('T')[0];
};

/**
 * An `Intl.DateTimeFormat` instance configured to format dates as full month
 * names in British English (e.g., "January", "February", "March").
 *
 * @example
 * fullMonthNameFormatter.format(new Date(2024, 0, 1)); // Returns "January"
 */
const fullMonthNameFormatter = new Intl.DateTimeFormat('en-GB', { month: 'long' });

/**
 * Returns the localized full month name for a given year and 1-based month
 * number.
 *
 * @param year - The full year (for example, `2026`).
 * @param month - The month number from `1` (January) to `12` (December).
 * @returns The formatted month name (for example, `"January"`), based on the
 * configured formatter locale.
 */
export const getFullMonthName = (year: number, month: number) =>
    fullMonthNameFormatter.format(new Date(year, month - 1, 1));
