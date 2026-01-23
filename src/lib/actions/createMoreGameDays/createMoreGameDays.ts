import 'server-only';

import gameDayService from '@/services/GameDay';
import type { CreateMoreGameDaysInput } from '@/types/CreateMoreGameDaysInput';

interface CreateMoreGameDaysDeps {
    gameDayService: Pick<typeof gameDayService, 'create'>;
}

const defaultDeps: CreateMoreGameDaysDeps = {
    gameDayService,
};

/**
 * Parses a date string in the format "YYYY-MM-DD" and returns a Date object set
 * to 18:00:00 local time on that day.
 *
 * @param value - The date string to parse, expected in "YYYY-MM-DD" format.
 * @returns A Date object representing the parsed date at 18:00:00.
 * @throws If the input string is not in the correct format or cannot be parsed
 * as a valid date.
 */
const parseDateString = (value: string) => {
    const parts = value.split('-').map((part) => Number(part));
    if (parts.length !== 3) {
        throw new Error(`Invalid date string: ${value}`);
    }

    const [year, month, day] = parts;
    const date = new Date(year, month - 1, day, 18, 0, 0, 0);
    if (Number.isNaN(date.getTime())) {
        throw new Error(`Invalid date string: ${value}`);
    }

    return date;
};

/**
 * Creates multiple game day entries based on the provided input data.
 *
 * Iterates over each row in the input, parses the date, trims and validates the
 * comment, and delegates the creation of each game day to the injected
 * gameDayService dependency.
 *
 * @param data - The input containing rows of game day information to be
 * created.
 * @param deps - Optional dependencies required for creating game days. Defaults
 * to `defaultDeps`.
 * @returns A promise that resolves to an array of created game day results.
 */
export async function createMoreGameDaysCore(
    data: CreateMoreGameDaysInput,
    deps: CreateMoreGameDaysDeps = defaultDeps,
) {
    return await Promise.all(
        data.rows.map((row) => {
            const date = parseDateString(row.date);
            const comment = row.comment?.trim();

            return deps.gameDayService.create({
                year: date.getFullYear(),
                date,
                game: row.game,
                comment: comment && comment.length > 0 ? comment : null,
            });
        }),
    );
}
