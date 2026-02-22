import * as Sentry from '@sentry/nextjs';
import { NextRequest } from 'next/server';
import type { Mock } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ValidationError } from '@/lib/errors';

vi.mock('@sentry/nextjs', () => ({
    captureException: vi.fn(),
}));

vi.mock('@/actions/claimPlayerInvitation', () => ({
    claimPlayerInvitation: vi.fn(),
}));

vi.mock('@/actions/sendEnquiry', () => ({
    deliverContactEnquiry: vi.fn(),
}));

vi.mock('@/actions/verifyEmail', () => ({
    verifyEmail: vi.fn(),
}));

import { claimPlayerInvitation } from '@/actions/claimPlayerInvitation';
import { deliverContactEnquiry } from '@/actions/sendEnquiry';
import { verifyEmail } from '@/actions/verifyEmail';
import { GET } from '@/app/api/footy/auth/verify/[purpose]/[token]/route';

/**
 * Route path used for verifying auth-linked tokens.
 */
const routePath = '/api/footy/auth/verify/player-invite/test-token';

/**
 * Redirect destination injected into requests for response-location assertions.
 */
const redirectPath = '/footy/profile';

describe('GET /api/footy/auth/verify/[purpose]/[token]', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (claimPlayerInvitation as Mock).mockResolvedValue({});
        (verifyEmail as Mock).mockResolvedValue({});
        (deliverContactEnquiry as Mock).mockResolvedValue({});
    });

    it('redirects with merged payload params on success', async () => {
        (claimPlayerInvitation as Mock).mockResolvedValue({
            playerId: '99',
            verified: 'true',
        });
        const request = new NextRequest(
            `http://localhost${routePath}?redirect=${encodeURIComponent(redirectPath)}`,
        );
        const response = await GET(request, {
            params: Promise.resolve({ purpose: 'player-invite', token: 'test-token' }),
        });
        const locationHeader = response.headers.get('location');

        expect(response.status).toBe(307);
        expect(locationHeader).toBeTruthy();
        const location = new URL(locationHeader!, 'http://localhost');
        expect(location.pathname).toBe(redirectPath);
        expect(location.searchParams.get('playerId')).toBe('99');
        expect(location.searchParams.get('verified')).toBe('true');
        expect(Sentry.captureException).not.toHaveBeenCalled();
    });

    it('does not capture expected domain errors', async () => {
        (claimPlayerInvitation as Mock).mockRejectedValue(
            new ValidationError('Invitation has expired.'),
        );
        const request = new NextRequest(
            `http://localhost${routePath}?redirect=${encodeURIComponent(redirectPath)}`,
        );
        const response = await GET(request, {
            params: Promise.resolve({ purpose: 'player-invite', token: 'test-token' }),
        });
        const locationHeader = response.headers.get('location');

        expect(response.status).toBe(307);
        const location = new URL(locationHeader!, 'http://localhost');
        expect(location.pathname).toBe(redirectPath);
        expect(location.searchParams.get('error')).toBe('Invitation has expired.');
        expect(Sentry.captureException).not.toHaveBeenCalled();
    });

    it('captures unexpected failures in Sentry', async () => {
        (claimPlayerInvitation as Mock).mockRejectedValue(new Error('Database timeout'));
        const request = new NextRequest(
            `http://localhost${routePath}?redirect=${encodeURIComponent(redirectPath)}`,
        );
        const response = await GET(request, {
            params: Promise.resolve({ purpose: 'player-invite', token: 'test-token' }),
        });
        const locationHeader = response.headers.get('location');

        expect(response.status).toBe(307);
        const location = new URL(locationHeader!, 'http://localhost');
        expect(location.pathname).toBe(redirectPath);
        expect(location.searchParams.get('error')).toBe('Database timeout');
        expect(Sentry.captureException).toHaveBeenCalledTimes(1);
        const [, options] = vi.mocked(Sentry.captureException).mock.calls[0] as [Error, {
            tags?: Record<string, string>;
            extra?: Record<string, unknown>;
        }];
        expect(options.tags).toEqual(expect.objectContaining({
            layer: 'route',
            action: 'verifyAuthToken',
            route: '/api/footy/auth/verify/[purpose]/[token]',
            purpose: 'player-invite',
        }));
        expect(options.extra).toEqual(expect.objectContaining({
            redirectParam: redirectPath,
        }));
        expect(options.extra).not.toHaveProperty('token');
    });
});
