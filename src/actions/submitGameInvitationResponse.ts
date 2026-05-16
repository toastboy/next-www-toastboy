'use server';

import { revalidatePath } from 'next/cache';

import { submitGameInvitationResponseCore } from '@/lib/actions/submitGameInvitationResponse';
import { broadcast } from '@/lib/events';
import { InvitationResponseInputSchema } from '@/types/actions/SubmitGameInvitationResponse';
import { FootyChannel } from '@/types/FootyChannel';

export async function submitGameInvitationResponse(rawData: unknown) {
    const data = InvitationResponseInputSchema.parse(rawData);
    const result = await submitGameInvitationResponseCore(data);

    revalidatePath('/footy/admin/picker');
    revalidatePath('/footy/admin/responses');
    revalidatePath('/footy/response');
    broadcast(FootyChannel.Responses);

    return result;
}
