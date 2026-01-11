import { NextRequest, NextResponse } from 'next/server';

import { deliverContactEnquiry } from '@/actions/sendEnquiry';
import { verifyEmail } from '@/actions/verifyEmail';
import { buildURLWithParams } from '@/lib/api';
import emailVerificationService from '@/services/EmailVerification';

export const dynamic = 'force-dynamic';

export const GET = async (request: NextRequest) => {
    const searchParams = request.nextUrl.searchParams;
    const target = searchParams.get('target');
    let redirect: URL;

    try {
        const data = await verifyEmail(searchParams.get('token') ?? '');

        if (data.purpose === 'contact_form') {
            await deliverContactEnquiry(data.verificationId);
            await emailVerificationService.markUsed(data.verificationId);

            redirect = buildURLWithParams('/footy/info', {
                enquiry: 'verified',
            });
        } else {
            redirect = buildURLWithParams('/footy/profile', {
                purpose: data.purpose,
                email: data.email,
            });
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unable to verify email.';
        const fallbackPath = target === 'contact' ? '/footy/info' : '/footy/profile';

        redirect = buildURLWithParams(fallbackPath, {
            error: errorMessage,
            ...(target === 'contact' ? { enquiry: 'error' } : {}),
        });
    }

    return NextResponse.redirect(redirect);
};
