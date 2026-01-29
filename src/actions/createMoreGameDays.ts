'use server';

import { revalidatePath } from 'next/cache';

import { createMoreGameDaysCore } from '@/lib/actions/createMoreGameDays';
import { CreateMoreGameDaysSchema } from '@/types/actions/CreateMoreGameDays';

export async function createMoreGameDays(rawData: unknown) {
    const data = CreateMoreGameDaysSchema.parse(rawData);
    const created = await createMoreGameDaysCore(data);

    revalidatePath('/footy/admin/moregames');
    revalidatePath('/footy/fixtures');

    return created;
}
