import { NextRequest } from 'next/server';
import type { Mock } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/gameInvitations', () => ({
    getGameInvitationResponseDetails: vi.fn(),
}));

import { GET } from '@/app/api/footy/response/[token]/route';
import { getGameInvitationResponseDetails } from '@/lib/gameInvitations';

/**
 * A sample invitation response details object returned by the mock.
 */
const sampleDetails = {
    token: 'test-token',
    playerId: 7,
    playerName: 'Alice',
    playerLogin: 'alice@example.com',
    gameDayId: 42,
    response: 'Yes',
    goalie: false,
    comment: 'Looking forward to it',
};

describe('GET /api/footy/response/[token]', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('redirects to /footy/response with all invitation details on success', async () => {
        (getGameInvitationResponseDetails as Mock).mockResolvedValue(sampleDetails);
        const request = new NextRequest('http://localhost/api/footy/response/test-token');
        const response = await GET(request, {
            params: Promise.resolve({ token: 'test-token' }),
        });

        expect(response.status).toBe(307);
        const locationHeader = response.headers.get('location');
        expect(locationHeader).toBeTruthy();
        const location = new URL(locationHeader!, 'http://localhost');
        expect(location.pathname).toBe('/footy/response');
        expect(location.searchParams.get('token')).toBe('test-token');
        expect(location.searchParams.get('playerId')).toBe('7');
        expect(location.searchParams.get('playerName')).toBe('Alice');
        expect(location.searchParams.get('gameDayId')).toBe('42');
        expect(location.searchParams.get('response')).toBe('Yes');
        expect(location.searchParams.get('goalie')).toBe('false');
        expect(location.searchParams.get('comment')).toBe('Looking forward to it');
    });

    it('omits response when outcome has no response yet', async () => {
        (getGameInvitationResponseDetails as Mock).mockResolvedValue({
            ...sampleDetails,
            response: null,
        });
        const request = new NextRequest('http://localhost/api/footy/response/test-token');
        const response = await GET(request, {
            params: Promise.resolve({ token: 'test-token' }),
        });

        const location = new URL(response.headers.get('location')!, 'http://localhost');
        expect(location.searchParams.get('response')).toBeNull();
    });

    it('uses an empty string for comment when no comment is present', async () => {
        (getGameInvitationResponseDetails as Mock).mockResolvedValue({
            ...sampleDetails,
            comment: null,
        });
        const request = new NextRequest('http://localhost/api/footy/response/test-token');
        const response = await GET(request, {
            params: Promise.resolve({ token: 'test-token' }),
        });

        const location = new URL(response.headers.get('location')!, 'http://localhost');
        expect(location.searchParams.get('comment')).toBe('');
    });

    it('uses "true" for goalie when the player is a goalie', async () => {
        (getGameInvitationResponseDetails as Mock).mockResolvedValue({
            ...sampleDetails,
            goalie: true,
        });
        const request = new NextRequest('http://localhost/api/footy/response/test-token');
        const response = await GET(request, {
            params: Promise.resolve({ token: 'test-token' }),
        });

        const location = new URL(response.headers.get('location')!, 'http://localhost');
        expect(location.searchParams.get('goalie')).toBe('true');
    });

    it('redirects to /footy/response with an error when the invitation is not found', async () => {
        (getGameInvitationResponseDetails as Mock).mockResolvedValue(null);
        const request = new NextRequest('http://localhost/api/footy/response/unknown-token');
        const response = await GET(request, {
            params: Promise.resolve({ token: 'unknown-token' }),
        });

        expect(response.status).toBe(307);
        const location = new URL(response.headers.get('location')!, 'http://localhost');
        expect(location.pathname).toBe('/footy/response');
        expect(location.searchParams.get('error')).toBe('Invitation not found.');
    });

    it('redirects to /footy/response with an error when the token is empty', async () => {
        const request = new NextRequest('http://localhost/api/footy/response/');
        const response = await GET(request, {
            params: Promise.resolve({ token: '' }),
        });

        expect(response.status).toBe(307);
        const location = new URL(response.headers.get('location')!, 'http://localhost');
        expect(location.pathname).toBe('/footy/response');
        expect(location.searchParams.get('error')).toBe('Missing token.');
    });
});
