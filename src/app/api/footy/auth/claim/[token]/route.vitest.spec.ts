import * as Sentry from '@sentry/nextjs';
import { NextRequest } from 'next/server';
import type { Mock } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ValidationError } from '@/lib/errors';

vi.mock('@sentry/nextjs', () => ({
    captureException: vi.fn(),
}));

vi.mock('@/actions/claimPlayerInvitation', () => ({
    finalizePlayerInvitationClaim: vi.fn(),
}));

import { finalizePlayerInvitationClaim } from '@/actions/claimPlayerInvitation';
import { GET } from '@/app/api/footy/auth/claim/[token]/route';

/**
 * Route path used for invitation-claim finalization.
 */
const routePath = '/api/footy/auth/claim/test-token';

/**
 * Redirect destination injected into requests for response-location assertions.
 */
const redirectPath = '/footy/profile';

describe('GET /api/footy/auth/claim/[token]', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (finalizePlayerInvitationClaim as Mock).mockResolvedValue(undefined);
    });

    it('redirects to the requested path on success', async () => {
        const request = new NextRequest(
            `http://localhost${routePath}?redirect=${encodeURIComponent(redirectPath)}`,
        );
        const response = await GET(request, {
            params: Promise.resolve({ token: 'test-token' }),
        });
        const locationHeader = response.headers.get('location');

        expect(response.status).toBe(307);
        expect(locationHeader).toBeTruthy();
        const location = new URL(locationHeader!, 'http://localhost');
        expect(location.pathname).toBe(redirectPath);
        expect(location.search).toBe('');
        expect(Sentry.captureException).not.toHaveBeenCalled();
    });

    it('does not capture expected domain errors', async () => {
        (finalizePlayerInvitationClaim as Mock).mockRejectedValue(
            new ValidationError('Invitation has expired.'),
        );
        const request = new NextRequest(
            `http://localhost${routePath}?redirect=${encodeURIComponent(redirectPath)}`,
        );
        const response = await GET(request, {
            params: Promise.resolve({ token: 'test-token' }),
        });
        const locationHeader = response.headers.get('location');

        expect(response.status).toBe(307);
        const location = new URL(locationHeader!, 'http://localhost');
        expect(location.pathname).toBe(redirectPath);
        expect(location.searchParams.get('error')).toBe('Invitation has expired.');
        expect(Sentry.captureException).not.toHaveBeenCalled();
    });

    it('captures unexpected failures in Sentry', async () => {
        (finalizePlayerInvitationClaim as Mock).mockRejectedValue(new Error('Upstream auth timeout'));
        const request = new NextRequest(
            `http://localhost${routePath}?redirect=${encodeURIComponent(redirectPath)}`,
        );
        const response = await GET(request, {
            params: Promise.resolve({ token: 'test-token' }),
        });
        const locationHeader = response.headers.get('location');

        expect(response.status).toBe(307);
        const location = new URL(locationHeader!, 'http://localhost');
        expect(location.pathname).toBe(redirectPath);
        expect(location.searchParams.get('error')).toBe('Upstream auth timeout');
        expect(Sentry.captureException).toHaveBeenCalledTimes(1);
        const [, options] = vi.mocked(Sentry.captureException).mock.calls[0] as [Error, {
            tags?: Record<string, string>;
            extra?: Record<string, unknown>;
        }];
        expect(options.tags).toEqual(expect.objectContaining({
            layer: 'route',
            action: 'finalizePlayerInvitationClaim',
            route: '/api/footy/auth/claim/[token]',
        }));
        expect(options.extra).toEqual(expect.objectContaining({
            redirectParam: redirectPath,
        }));
        expect(options.extra).not.toHaveProperty('token');
    });
});
