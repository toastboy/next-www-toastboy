import { OutcomeType } from 'prisma/generated/schemas/models/Outcome.schema';

import { createMockOutcome } from '@/tests/mocks/factories/outcomeFactory';

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

export const defaultOutcomeList: OutcomeType[] = Array.from({ length: 100 }, (_, index) =>
    createMockOutcome({
        playerId: index % 10 + 1,
        gameDayId: Math.floor(index / 10 + 1),
    }),
);
