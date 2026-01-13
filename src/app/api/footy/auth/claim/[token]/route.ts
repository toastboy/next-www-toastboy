import { NextRequest, NextResponse } from 'next/server';

import { finalizePlayerInvitationClaim } from '@/actions/claimPlayerInvitation';
import { buildURLWithParams } from '@/lib/api';

export const dynamic = 'force-dynamic';

/**
 * HTTP GET route handler that finalizes a player invitation claim using a token
 * route parameter and redirects the client to a specified URL.
 *
 * The handler:
 * - Resolves `token` from `props.params`.
 * - Reads the `redirect` query parameter from the incoming `request.nextUrl`
 *   (defaults to '/').
 * - Calls `finalizePlayerInvitationClaim(token)` to complete the claim.
 * - On success, redirects to the resolved redirect URL.
 * - On failure, redirects to the same URL with an `error` query parameter
 *   containing the error message.
 *
 * @param request - The incoming NextRequest (used to read search params like
 * `redirect`).
 * @param props - An object containing a `params` promise that resolves to route
 * params (expects `{ token }`).
 * @returns A NextResponse that performs a redirect to the target URL,
 * optionally including an `error` query param.
 */
export const GET = async (request: NextRequest, props: { params: Promise<Record<string, string>> }) => {
    const { token } = await props.params;
    const searchParams = request.nextUrl.searchParams;
    const redirectParam = searchParams.get('redirect') ?? '/';
    let redirect: URL;

    try {
        await finalizePlayerInvitationClaim(token);

        redirect = buildURLWithParams(redirectParam, {});
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unable to finalize invitation.';

        redirect = buildURLWithParams(redirectParam, { error: errorMessage });
    }

    return NextResponse.redirect(redirect);
};
