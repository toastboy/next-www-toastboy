import type { OutcomePlayerType } from '@/types/OutcomePlayerType';

const createResponsePlayer = (
    id: number,
    name: string,
): OutcomePlayerType['player'] => ({
    id,
    name,
    accountEmail: null,
    anonymous: false,
    joined: null,
    finished: null,
    born: null,
    comment: null,
    introducedBy: null,
});

const createMockOutcomePlayer = (
    overrides: Partial<OutcomePlayerType>,
): OutcomePlayerType => ({
    id: 1,
    gameDayId: 1249,
    playerId: 1,
    response: null,
    responseInterval: null,
    points: null,
    team: null,
    comment: null,
    pub: 1,
    paid: false,
    goalie: false,
    player: createResponsePlayer(1, 'Alex Keeper'),
    ...overrides,
});

export const defaultResponsesAdminData: OutcomePlayerType[] = [
    createMockOutcomePlayer({
        id: 1,
        playerId: 1,
        response: 'Yes',
        goalie: true,
        comment: 'I can cover first half',
        player: createResponsePlayer(1, 'Alex Keeper'),
    }),
    createMockOutcomePlayer({
        id: 2,
        playerId: 2,
        response: 'No',
        comment: 'Out of town',
        player: createResponsePlayer(2, 'Britt Winger'),
    }),
    createMockOutcomePlayer({
        id: 3,
        playerId: 3,
        comment: '',
        player: createResponsePlayer(3, 'Casey Mid'),
    }),
    createMockOutcomePlayer({
        id: 4,
        playerId: 4,
        comment: '',
        player: createResponsePlayer(4, 'Dev Striker'),
    }),
];
