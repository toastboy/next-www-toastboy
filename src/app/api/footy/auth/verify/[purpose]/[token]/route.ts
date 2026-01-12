import { NextRequest, NextResponse } from 'next/server';

import { claimPlayerInvitation } from '@/actions/claimPlayerInvitation';
import { deliverContactEnquiry } from '@/actions/sendEnquiry';
import { verifyEmail } from '@/actions/verifyEmail';
import { buildURLWithParams } from '@/lib/api';

export const dynamic = 'force-dynamic';

export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    const { purpose, token } = await props.params;
    const searchParams = request.nextUrl.searchParams;
    const redirectParam = searchParams.get('redirect') ?? '/';
    let redirect: URL;

    try {
        let data = {};

        switch (purpose) {
            case 'player-invite':
                data = await claimPlayerInvitation(token);
                break;
            case 'extra-email':
                data = await verifyEmail(token);
                break;
            case 'enquiry':
                data = await deliverContactEnquiry(token);
                break;
            default:
                throw new Error('Invalid verification purpose. Expected: player-invite, extra-email, or enquiry.');
        }

        redirect = buildURLWithParams(redirectParam, data);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unable to verify email.';

        redirect = buildURLWithParams(redirectParam ?? '/', {
            error: errorMessage,
            ...(purpose === 'enquiry' ? { enquiry: 'error' } : {}),
        });
    }

    return NextResponse.redirect(redirect);
};
