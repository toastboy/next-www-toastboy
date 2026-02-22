import { NextRequest, NextResponse } from 'next/server';

import { claimPlayerInvitation } from '@/actions/claimPlayerInvitation';
import { deliverContactEnquiry } from '@/actions/sendEnquiry';
import { verifyEmail } from '@/actions/verifyEmail';
import { buildURLWithParams } from '@/lib/api';
import { ValidationError } from '@/lib/errors';
import { captureUnexpectedError } from '@/lib/observability/sentry';

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
                throw new ValidationError(
                    `Invalid verification purpose "${purpose}". Must be one of: player-invite, extra-email, enquiry.`,
                );
        }

        redirect = buildURLWithParams(redirectParam, data);
    } catch (error) {
        captureUnexpectedError(error, {
            layer: 'route',
            action: 'verifyAuthToken',
            route: '/api/footy/auth/verify/[purpose]/[token]',
            tags: {
                purpose,
            },
            extra: {
                redirectParam,
            },
        });
        const errorMessage = error instanceof Error ? error.message : 'Unable to verify email.';

        redirect = buildURLWithParams(redirectParam, { error: errorMessage });
    }

    return NextResponse.redirect(redirect);
};
