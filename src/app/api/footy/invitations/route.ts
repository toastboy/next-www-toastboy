import { timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

import { getInvitationDecision } from '@/lib/invitations';
import { getSecrets } from '@/lib/secrets';
import { NewGameInputSchema } from '@/types/NewGameInput';

const isAuthorized = (request: NextRequest) => {
    const secret = getSecrets().CRON_SECRET?.trim() ?? '';
    const header = request.headers.get('x-cron-secret')?.trim() ?? '';

    if (!secret || !header) {
        return false;
    }

    const secretBuffer = Buffer.from(secret);
    const headerBuffer = Buffer.from(header);
    if (secretBuffer.length !== headerBuffer.length) {
        return false;
    }

    return timingSafeEqual(secretBuffer, headerBuffer);
};

export const POST = async (request: NextRequest) => {
    if (!isAuthorized(request)) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    let overrideTimeCheck = false;
    let customMessage: string | undefined;

    const body: unknown = await request.json().catch(() => null);
    if (body) {
        const parsed = NewGameInputSchema.partial().safeParse(body);
        if (parsed.success) {
            overrideTimeCheck = parsed.data.overrideTimeCheck ?? false;
            customMessage = parsed.data.customMessage?.trim();
        }
    }

    const decision = await getInvitationDecision({
        overrideTimeCheck,
        customMessage: customMessage && customMessage.length > 0 ? customMessage : null,
    });

    return NextResponse.json(decision, { status: 200 });
};
