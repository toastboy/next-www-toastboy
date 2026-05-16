import { NextRequest } from 'next/server';
import type { Mock } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/actions/triggerInvitations', () => ({
    triggerInvitationsCore: vi.fn(),
}));

vi.mock('@/lib/secrets', () => ({
    getSecrets: vi.fn(),
}));

vi.mock('next/cache', () => ({
    revalidatePath: vi.fn(),
}));

vi.mock('@/lib/events', () => ({
    broadcast: vi.fn(),
}));

import { revalidatePath } from 'next/cache';

import { POST } from '@/app/api/footy/invitations/route';
import { triggerInvitationsCore } from '@/lib/actions/triggerInvitations';
import { broadcast } from '@/lib/events';
import { getSecrets } from '@/lib/secrets';

/**
 * A valid CRON_SECRET used across tests to authorise requests.
 */
const VALID_SECRET = 'supersecret';

/**
 * Builds a POST request to the invitations endpoint with the given options.
 */
function makeRequest(options: {
    secret?: string;
    body?: unknown;
} = {}): NextRequest {
    const headers: Record<string, string> = {};
    if (options.secret !== undefined) {
        headers['x-cron-secret'] = options.secret;
    }
    return new NextRequest('http://localhost/api/footy/invitations', {
        method: 'POST',
        headers,
        body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
}

describe('POST /api/footy/invitations', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (getSecrets as Mock).mockReturnValue({ CRON_SECRET: VALID_SECRET });
        (triggerInvitationsCore as Mock).mockResolvedValue({ sent: true, gameDayId: 42 });
    });

    describe('authorization', () => {
        it('returns 401 when no secret header is provided', async () => {
            const response = await POST(makeRequest());
            expect(response.status).toBe(401);
            const body = await response.json() as { message: string };
            expect(body.message).toBe('Unauthorized');
            expect(triggerInvitationsCore).not.toHaveBeenCalled();
            expect(revalidatePath).not.toHaveBeenCalled();
            expect(broadcast).not.toHaveBeenCalled();
        });

        it('returns 401 when the secret header does not match', async () => {
            const response = await POST(makeRequest({ secret: 'wrong-secret' }));
            expect(response.status).toBe(401);
            const body = await response.json() as { message: string };
            expect(body.message).toBe('Unauthorized');
            expect(triggerInvitationsCore).not.toHaveBeenCalled();
            expect(revalidatePath).not.toHaveBeenCalled();
            expect(broadcast).not.toHaveBeenCalled();
        });

        it('returns 401 when the stored secret is empty', async () => {
            (getSecrets as Mock).mockReturnValue({ CRON_SECRET: '' });
            const response = await POST(makeRequest({ secret: '' }));
            expect(response.status).toBe(401);
            expect(triggerInvitationsCore).not.toHaveBeenCalled();
            expect(revalidatePath).not.toHaveBeenCalled();
            expect(broadcast).not.toHaveBeenCalled();
        });

        it('returns 401 when the stored secret is undefined', async () => {
            (getSecrets as Mock).mockReturnValue({});
            const response = await POST(makeRequest({ secret: VALID_SECRET }));
            expect(response.status).toBe(401);
            expect(triggerInvitationsCore).not.toHaveBeenCalled();
            expect(revalidatePath).not.toHaveBeenCalled();
            expect(broadcast).not.toHaveBeenCalled();
        });
    });

    describe('authorized requests', () => {
        it('calls triggerInvitationsCore with defaults when body is absent', async () => {
            const response = await POST(makeRequest({ secret: VALID_SECRET }));

            expect(response.status).toBe(200);
            expect(triggerInvitationsCore).toHaveBeenCalledWith({
                overrideTimeCheck: false,
                customMessage: '',
            });
            expect(revalidatePath).toHaveBeenCalledWith('/footy/admin/newgame');
            expect(revalidatePath).toHaveBeenCalledWith('/footy/admin/responses');
            expect(revalidatePath).toHaveBeenCalledWith('/footy/admin/picker');
            expect(revalidatePath).toHaveBeenCalledWith('/footy/response');
            expect(revalidatePath).toHaveBeenCalledTimes(4);
            expect(broadcast).toHaveBeenCalledWith('invitations');
            expect(broadcast).toHaveBeenCalledTimes(1);
            const body = await response.json() as { sent: boolean; gameDayId: number };
            expect(body).toEqual({ sent: true, gameDayId: 42 });
        });

        it('calls triggerInvitationsCore with defaults when body is invalid JSON', async () => {
            const request = new NextRequest('http://localhost/api/footy/invitations', {
                method: 'POST',
                headers: { 'x-cron-secret': VALID_SECRET },
                body: 'not-json',
            });
            const response = await POST(request);

            expect(response.status).toBe(200);
            expect(triggerInvitationsCore).toHaveBeenCalledWith({
                overrideTimeCheck: false,
                customMessage: '',
            });
        });

        it('forwards overrideTimeCheck from a valid body', async () => {
            const response = await POST(
                makeRequest({ secret: VALID_SECRET, body: { overrideTimeCheck: true } }),
            );

            expect(response.status).toBe(200);
            expect(triggerInvitationsCore).toHaveBeenCalledWith(
                expect.objectContaining({ overrideTimeCheck: true }),
            );
        });

        it('forwards a trimmed customMessage from a valid body', async () => {
            const response = await POST(
                makeRequest({ secret: VALID_SECRET, body: { customMessage: '  Hello!  ' } }),
            );

            expect(response.status).toBe(200);
            expect(triggerInvitationsCore).toHaveBeenCalledWith(
                expect.objectContaining({ customMessage: 'Hello!' }),
            );
        });

        it('silently ignores unrecognised body fields', async () => {
            const response = await POST(
                makeRequest({ secret: VALID_SECRET, body: { unknownField: 'ignored' } }),
            );

            expect(response.status).toBe(200);
            expect(triggerInvitationsCore).toHaveBeenCalledWith({
                overrideTimeCheck: false,
                customMessage: '',
            });
        });

        it('uses defaults when body fields fail schema validation', async () => {
            const response = await POST(
                makeRequest({
                    secret: VALID_SECRET,
                    body: { overrideTimeCheck: 'yes', customMessage: 42 },
                }),
            );

            expect(response.status).toBe(200);
            expect(triggerInvitationsCore).toHaveBeenCalledWith({
                overrideTimeCheck: false,
                customMessage: '',
            });
        });

        it('returns a JSON error response when triggerInvitationsCore throws', async () => {
            (triggerInvitationsCore as Mock).mockRejectedValue(new Error('Database error'));
            const response = await POST(makeRequest({ secret: VALID_SECRET }));

            expect(response.status).not.toBe(200);
            expect(revalidatePath).not.toHaveBeenCalled();
            expect(broadcast).not.toHaveBeenCalled();
        });
    });
});
