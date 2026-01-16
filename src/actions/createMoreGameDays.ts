'use server';

import { revalidatePath } from 'next/cache';

import gameDayService from '@/services/GameDay';
import { CreateMoreGameDaysSchema } from '@/types/CreateMoreGameDaysInput';

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

export async function createMoreGameDays(rawData: unknown) {
    const data = CreateMoreGameDaysSchema.parse(rawData);

    const created = await Promise.all(
        data.rows.map((row) => {
            const date = parseDateString(row.date);
            const comment = row.comment?.trim();

            return gameDayService.create({
                year: date.getFullYear(),
                date,
                game: row.game,
                comment: comment && comment.length > 0 ? comment : null,
            });
        }),
    );

    revalidatePath('/footy/admin/moregames');
    revalidatePath('/footy/fixtures');

    return created;
}
