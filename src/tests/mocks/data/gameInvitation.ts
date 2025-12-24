import { GameInvitationType } from 'prisma/zod/schemas/models/GameInvitation.schema';

export const defaultGameInvitation: GameInvitationType = {
    uuid: '{123e4567-e89b-12d3-a456-426614174000}',
    playerId: 1,
    gameDayId: 1,
};

export const createMockGameInvitation = (overrides: Partial<GameInvitationType> = {}): GameInvitationType => ({
    ...defaultGameInvitation,
    ...overrides,
});

export const buildUuidFromIndex = (i: number): string => {
    const hex = Math.abs(i).toString(16) || '0';
    const repeated = hex.repeat(Math.ceil(32 / hex.length)).slice(0, 32);
    const uuid = `${repeated.slice(0, 8)}-${repeated.slice(8, 12)}-${repeated.slice(12, 16)}-${repeated.slice(16, 20)}-${repeated.slice(20, 32)}`;
    return `{${uuid}}`;
};

export const defaultGameInvitationList: GameInvitationType[] = Array.from({ length: 100 }, (_, index) =>
    createMockGameInvitation({
        uuid: buildUuidFromIndex(index + 1),
    }),
);
