import { PlayerExtraEmailType } from 'prisma/zod/schemas/models/PlayerExtraEmail.schema';

export const defaultPlayerExtraEmail: PlayerExtraEmailType = {
    id: 1,
    playerId: 1,
    email: 'gary.player@example.com',
    verifiedAt: new Date('2021-01-01'),
    createdAt: new Date('2021-01-01'),
};

export const createMockPlayerExtraEmail = (overrides: Partial<PlayerExtraEmailType> = {}): PlayerExtraEmailType => ({
    ...defaultPlayerExtraEmail,
    ...overrides,
});

export const defaultPlayerExtraEmails: PlayerExtraEmailType[] = [
    defaultPlayerExtraEmail,
    createMockPlayerExtraEmail({ id: 2, email: 'g.player@hiswork.com' }),
];
