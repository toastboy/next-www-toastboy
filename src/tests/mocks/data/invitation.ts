import { InvitationType } from '@/generated/zod/schemas/models/Invitation.schema';

export const defaultInvitation: InvitationType = {
    uuid: '{123e4567-e89b-12d3-a456-426614174000}',
    playerId: 1,
    gameDayId: 1,
};

export const createMockInvitation = (overrides: Partial<InvitationType> = {}): InvitationType => ({
    ...defaultInvitation,
    ...overrides,
});

export const buildUuidFromIndex = (i: number): string => {
    const hex = Math.abs(i).toString(16) || '0';
    const repeated = hex.repeat(Math.ceil(32 / hex.length)).slice(0, 32);
    const uuid = `${repeated.slice(0, 8)}-${repeated.slice(8, 12)}-${repeated.slice(12, 16)}-${repeated.slice(16, 20)}-${repeated.slice(20, 32)}`;
    return `{${uuid}}`;
};

export const defaultInvitationList: InvitationType[] = Array.from({ length: 100 }, (_, index) =>
    createMockInvitation({
        uuid: buildUuidFromIndex(index + 1),
    }),
);
