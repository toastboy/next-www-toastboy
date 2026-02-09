'use server';

import { revalidatePath } from 'next/cache';

import { SubmitPickerCore } from '@/lib/actions/submitPicker';
import { SubmitPickerInputSchema } from '@/types/actions/SubmitPicker';

export async function SubmitPicker(rawData: unknown) {
    const data = SubmitPickerInputSchema.parse(rawData);
    await SubmitPickerCore(data);

    revalidatePath('/footy/game');
}
