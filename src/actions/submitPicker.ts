'use server';

import { SubmitPickerCore } from '@/lib/actions/submitPicker';
import { SubmitPickerInputSchema } from '@/types/actions/SubmitPicker';

export async function SubmitPicker(rawData: unknown) {
    const data = SubmitPickerInputSchema.parse(rawData);
    return await SubmitPickerCore(data);
}
