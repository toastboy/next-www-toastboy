import { PlayerResponse } from 'prisma/generated/enums';
import { renderToStaticMarkup } from 'react-dom/server';
import type { Mock } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { GameInvitationResponseDetails } from '@/types/GameInvitationResponseDetails';

vi.mock('@/actions/submitGameInvitationResponse', () => ({
    submitGameInvitationResponse: vi.fn(),
}));

vi.mock('@/components/StatusNotification/StatusNotification', () => ({
    StatusNotification: vi.fn(() => null),
}));

vi.mock(
    '@/components/GameInvitationResponseForm/GameInvitationResponseForm',
    () => ({
        GameInvitationResponseForm: vi.fn(() => null),
    }),
);

vi.mock('@/lib/gameInvitations', () => ({
    getGameInvitationResponseDetails: vi.fn(),
}));

import Page from '@/app/footy/response/[token]/page';
import { GameInvitationResponseForm } from '@/components/GameInvitationResponseForm/GameInvitationResponseForm';
import { StatusNotification } from '@/components/StatusNotification/StatusNotification';
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

    it('fetches the invitation details for the token', async () => {
        (getGameInvitationResponseDetails as Mock).mockResolvedValue(
            sampleDetails,
        );

        const element = await Page({
            params: Promise.resolve({ token: sampleDetails.token }),
        });

        renderToStaticMarkup(element);

        expect(getGameInvitationResponseDetails).toHaveBeenCalledWith(
            sampleDetails.token,
        );
        const [[props]] = (GameInvitationResponseForm as Mock).mock.calls as [
            { details: GameInvitationResponseDetails },
        ][];
        expect(props.details).toEqual(sampleDetails);
    });

    it('renders a missing-details message when the invitation cannot be found', async () => {
        (getGameInvitationResponseDetails as Mock).mockResolvedValue(null);

        renderToStaticMarkup(
            await Page({
                params: Promise.resolve({ token: 'missing-token' }),
            }),
        );

        const [props] = (StatusNotification as Mock).mock.calls[0] as [
            { variant: unknown; message: unknown; anchor: unknown },
        ];
        expect(props.variant).toBe('plain');
        expect(props.message).toBe('Invitation details are missing.');
        expect(props.anchor).toEqual({
            href: '/footy/game',
            label: 'Go to the game page',
        });
    });
});
