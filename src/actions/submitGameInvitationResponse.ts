'use server';

import { revalidatePath } from 'next/cache';

import { coreSubmitGameInvitationResponse } from '@/lib/core/submitGameInvitationResponse';
import { broadcast } from '@/lib/events';
import { InvitationResponseInputSchema } from '@/types/actions/SubmitGameInvitationResponse';
import { FootyChannel } from '@/types/FootyChannel';

export async function submitGameInvitationResponse(rawData: unknown) {
    const data = InvitationResponseInputSchema.parse(rawData);
    const result = await coreSubmitGameInvitationResponse(data);

    revalidatePath('/footy/admin/picker');
    revalidatePath('/footy/admin/responses');
    revalidatePath('/footy/response/[token]', 'page');
    broadcast(FootyChannel.Responses);

    return result;
}
