import { Anchor } from '@mantine/core';
import type { GameDayType } from 'prisma/zod/schemas/models/GameDay.schema';

export interface Props {
    gameDay: GameDayType,
    format?: 'iso' | 'ordinal';
}

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
function getOrdinal(n: number): string {
    const rule = rules.select(n);
    const suffix = suffixes.get(rule);
    return `${n}${suffix ?? "th"}`;
}

export const GameDayLink = ({ gameDay, format = 'iso' }: Props) => {
    return (
        <Anchor href={`/footy/game/${gameDay.id}`}>
            {
                format === 'iso' ?
                    gameDay.date.toISOString().split('T')[0] :
                    getOrdinal(gameDay.date.getDate())
            }
        </Anchor>
    );
};
