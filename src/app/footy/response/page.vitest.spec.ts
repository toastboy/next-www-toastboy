import { PlayerResponse } from 'prisma/generated/enums';
import { renderToStaticMarkup } from 'react-dom/server';
import type { Mock } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { GameInvitationResponseDetails } from '@/types/GameInvitationResponseDetails';

vi.mock('next/navigation', () => ({
    redirect: vi.fn(() => {
        throw new Error('redirected');
    }),
}));

vi.mock('@/actions/submitGameInvitationResponse', () => ({
    submitGameInvitationResponse: vi.fn(),
}));

vi.mock('@mantine/core', () => ({
    Anchor: ({ children }: { children?: unknown }) => children,
    Box: ({ children }: { children?: unknown }) => children,
    Text: ({ children }: { children?: unknown }) => children,
}));

vi.mock('@/components/GameInvitationResponseForm/GameInvitationResponseForm', () => ({
    GameInvitationResponseForm: vi.fn(() => null),
}));

vi.mock('@/lib/gameInvitations', () => ({
    getGameInvitationResponseDetails: vi.fn(),
}));

import { redirect } from 'next/navigation';

import Page from '@/app/footy/response/page';
import { GameInvitationResponseForm } from '@/components/GameInvitationResponseForm/GameInvitationResponseForm';
import { getGameInvitationResponseDetails } from '@/lib/gameInvitations';

const sampleDetails = {
    token: 'fresh-token',
    playerId: 7,
    playerName: 'Alice Example',
    playerLogin: 'alice-example',
    gameDayId: 42,
    response: PlayerResponse.Yes,
    goalie: true,
    comment: 'Looking forward to it',
};

describe('Game Invitation Response page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('redirects to /footy/game when neither token nor error is present', async () => {
        await expect(Page({ searchParams: Promise.resolve({}) })).rejects.toThrow('redirected');

        expect(redirect).toHaveBeenCalledWith('/footy/game');
    });

    it('renders an error message when an error param is present', async () => {
        const element = await Page({ searchParams: Promise.resolve({ error: 'Invitation expired.' }) });

        const html = renderToStaticMarkup(element);
        expect(html).toContain('Invitation expired.');
        expect(html).toContain('Go to the game page');
    });

    it('fetches the latest invitation details for the token and ignores stale query params', async () => {
        (getGameInvitationResponseDetails as Mock).mockResolvedValue(sampleDetails);

        const element = await Page({
            searchParams: Promise.resolve({
                token: sampleDetails.token,
                playerId: '1',
                playerName: 'Stale Name',
                playerLogin: 'stale-login',
                gameDayId: '99',
                response: 'No',
                goalie: 'false',
                comment: 'stale comment',
            }),
        });

        renderToStaticMarkup(element);

        expect(getGameInvitationResponseDetails).toHaveBeenCalledWith(sampleDetails.token);
        const [[props]] = (GameInvitationResponseForm as Mock).mock.calls as [
            { details: GameInvitationResponseDetails }
        ][];
        expect(props.details).toEqual(sampleDetails);
    });

    it('renders a missing-details message when the invitation cannot be found', async () => {
        (getGameInvitationResponseDetails as Mock).mockResolvedValue(null);

        const element = await Page({ searchParams: Promise.resolve({ token: 'missing-token' }) });

        const html = renderToStaticMarkup(element);
        expect(html).toContain('Invitation details are missing.');
        expect(html).toContain('Go to the game page');
    });
});
