import { timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

import { triggerInvitations } from '@/actions/triggerInvitations';
import { getSecrets } from '@/lib/secrets';
import { NewGameInputSchema } from '@/types/actions/TriggerInvitations';

/**
 * Validates the authorization of an incoming request using a timing-safe comparison
 * of the cron secret header against the stored secret.
 *
 * This function performs a constant-time comparison to prevent timing attacks by:
 * 1. Retrieving the stored CRON_SECRET from the application secrets
 * 2. Extracting the x-cron-secret header from the request
 * 3. Comparing both values using a timing-safe equality check
 *
 * @param request - The incoming NextRequest object containing the authorization header
 * @returns `true` if the request is authorized (secrets match), `false` otherwise
 *
 * @remarks
 * - Returns `false` if either the secret or header is missing/empty
 * - Returns `false` if the secret and header have different lengths
 * - Uses `timingSafeEqual` to prevent timing-based attacks
 */
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

/**
 * Handles POST requests to send footy game invitations.
 *
 * This endpoint requires authorization and processes optional parameters for overriding
 * time checks and including custom messages in invitations.
 *
 * @param request - The Next.js request object containing the HTTP request data
 * @returns A JSON response with the invitation decision and HTTP status code
 *
 * @throws {401} When the request is not authorized
 *
 * @remarks
 * The request body may optionally include:
 * - `overrideTimeCheck`: Boolean to bypass time-based invitation restrictions
 * - `customMessage`: String containing a custom message to include with the invitation
 *
 * If the request body is invalid or missing, default values are used (overrideTimeCheck: false, customMessage: null)
 */
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

    const decision = await triggerInvitations({
        overrideTimeCheck,
        customMessage: customMessage && customMessage.length > 0 ? customMessage : '',
    });

    return NextResponse.json(decision, { status: 200 });
};
