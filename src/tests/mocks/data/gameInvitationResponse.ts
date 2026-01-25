import { PlayerResponse } from 'prisma/generated/browser';

import { GameInvitationResponseDetails } from '@/types/GameInvitationResponseDetails';

export const defaultGameInvitationResponseDetails: GameInvitationResponseDetails = {
    token: '123e4567-e89b-12d3-a456-426614174000',
    playerId: 1,
    playerName: 'Pat Example',
    playerLogin: 'pat-example',
    gameDayId: 42,
    response: PlayerResponse.Dunno,
    goalie: false,
    comment: null,
};

export const createMockGameInvitationResponseDetails = (
    overrides: Partial<GameInvitationResponseDetails> = {},
): GameInvitationResponseDetails => ({
    ...defaultGameInvitationResponseDetails,
    ...overrides,
});
