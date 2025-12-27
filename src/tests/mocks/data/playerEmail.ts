import { PlayerEmailType } from 'prisma/zod/schemas/models/PlayerEmail.schema';

export const defaultPlayerEmail: PlayerEmailType = {
    id: 1,
    playerId: 1,
    email: 'gary.player@example.com',
    verifiedAt: new Date('2021-01-01'),
    createdAt: new Date('2021-01-01'),
};

export const createMockPlayerEmail = (overrides: Partial<PlayerEmailType> = {}): PlayerEmailType => ({
    ...defaultPlayerEmail,
    ...overrides,
});

export const defaultPlayerEmails: PlayerEmailType[] = [
    defaultPlayerEmail,
    createMockPlayerEmail({ id: 2, email: 'g.player@hiswork.com' }),
];
