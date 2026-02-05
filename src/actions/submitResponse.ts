'use server';

import { SubmitResponseCore } from '@/lib/actions/submitResponse';
import { SubmitResponseInputSchema } from '@/types/actions/SubmitResponse';

export async function SubmitResponse(rawData: unknown) {
    const data = SubmitResponseInputSchema.parse(rawData);
    return await SubmitResponseCore(data);
}
