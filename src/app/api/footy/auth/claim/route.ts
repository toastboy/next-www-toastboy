import { NextRequest, NextResponse } from 'next/server';

import { claimPlayerInvitation } from '@/actions/claimPlayerInvitation';
import { buildURLWithParams } from '@/lib/api';

export const dynamic = 'force-dynamic';

export const GET = async (request: NextRequest) => {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token') ?? '';
    let redirect: URL;

    try {
        const data = await claimPlayerInvitation(token);

        redirect = buildURLWithParams('/footy/auth/claim', {
            name: data.player.name ?? '',
            email: data.email,
            token: token,
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unable to claim invitation.';

        redirect = buildURLWithParams('/footy/auth/claim', {
            error: errorMessage,
        });
    }

    return NextResponse.redirect(redirect);
};
