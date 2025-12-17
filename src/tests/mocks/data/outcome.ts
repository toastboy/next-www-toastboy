import { OutcomeType } from '@/generated/zod/schemas/models/Outcome.schema';

export const defaultOutcome: OutcomeType = {
    id: 1,
    gameDayId: 1,
    playerId: 12,
    response: 'Yes',
    responseInterval: 1000,
    points: 3,
    team: 'A',
    comment: 'Test comment',
    pub: 1,
    paid: false,
    goalie: false,
};

export const createMockOutcome = (overrides: Partial<OutcomeType> = {}): OutcomeType => ({
    ...defaultOutcome,
    ...overrides,
});

export const defaultOutcomeList: OutcomeType[] = Array.from({ length: 100 }, (_, index) =>
    createMockOutcome({
        playerId: index % 10 + 1,
        gameDayId: Math.floor(index / 10 + 1),
    }),
);
