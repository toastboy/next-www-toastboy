import { NextRequest, NextResponse } from 'next/server';

import { verifyEmail } from '@/actions/verifyEmail';
import { buildURLWithParams } from '@/lib/api';

export const dynamic = 'force-dynamic';

export const GET = async (request: NextRequest) => {
    const searchParams = request.nextUrl.searchParams;
    let redirect: URL;

    try {
        const data = await verifyEmail(searchParams.get('token') ?? '');

        redirect = buildURLWithParams('/footy/profile', {
            purpose: data.purpose,
            email: data.email,
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unable to verify email.';

        redirect = buildURLWithParams('/footy/profile', {
            error: errorMessage,
        });
    }

    return NextResponse.redirect(redirect);
};
