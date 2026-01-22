'use server';

import { submitGameInvitationResponseCore } from '@/lib/actions/submitGameInvitationResponse';
import { InvitationResponseInputSchema } from '@/types/InvitationResponseInput';

export async function submitGameInvitationResponse(rawData: unknown) {
    const data = InvitationResponseInputSchema.parse(rawData);
    return await submitGameInvitationResponseCore(data);
}
