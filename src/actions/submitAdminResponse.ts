'use server';

import { SubmitAdminResponseCore } from '@/lib/actions/submitAdminResponse';
import { AdminResponseInputSchema } from '@/types/actions/SubmitAdminResponse';

export async function SubmitAdminResponse(rawData: unknown) {
    const data = AdminResponseInputSchema.parse(rawData);
    return await SubmitAdminResponseCore(data);
}
