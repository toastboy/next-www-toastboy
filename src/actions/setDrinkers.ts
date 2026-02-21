'use server';

import { revalidatePath } from 'next/cache';

import { setDrinkersCore } from '@/lib/actions/setDrinkers';
import { SetDrinkersInputSchema } from '@/types/actions/SetDrinkers';

export async function setDrinkers(rawData: unknown) {
    const data = SetDrinkersInputSchema.parse(rawData);
    const result = await setDrinkersCore(data);

    revalidatePath('/footy/admin/drinkers');
    revalidatePath(`/footy/admin/drinkers/${data.gameDayId}`);
    revalidatePath('/footy/pub');
    revalidatePath('/footy/table/pub');
    revalidatePath(`/footy/game/${data.gameDayId}`);

    return result;
}
