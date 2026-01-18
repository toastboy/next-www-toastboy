import { NextRequest, NextResponse } from 'next/server';

import { buildURLWithParams } from '@/lib/api';
import { getGameInvitationResponseDetails } from '@/lib/gameInvitations';

export const dynamic = 'force-dynamic';

export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    const { token } = await props.params;
    if (!token) {
        const redirect = buildURLWithParams('/footy/response', {
            error: 'Missing token.',
        });
        return NextResponse.redirect(redirect);
    }

    const details = await getGameInvitationResponseDetails(token);
    if (!details) {
        const redirect = buildURLWithParams('/footy/response', {
            error: 'Invitation not found.',
        });
        return NextResponse.redirect(redirect);
    }

    const redirect = buildURLWithParams('/footy/response', {
        token: token,
        playerId: details.playerId.toString(),
        playerName: details.playerName,
        gameDayId: details.gameDayId.toString(),
        response: details.response?.toString() ?? '',
        goalie: details.goalie ? 'true' : 'false',
        comment: details.comment ?? '',
    });
    return NextResponse.redirect(redirect);
};
