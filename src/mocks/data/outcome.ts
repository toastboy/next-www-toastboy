import { Outcome } from 'prisma/generated/prisma/client';

export const defaultOutcome: Outcome = {
    id: 1000,
    response: 'Yes',
    responseInterval: 89724,
    points: 0,
    team: 'B',
    comment: "How do",
    pub: null,
    paid: null,
    goalie: false,
    gameDayId: 125,
    playerId: 1,
};
