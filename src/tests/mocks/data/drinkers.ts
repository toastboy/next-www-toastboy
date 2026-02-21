import type { OutcomePlayerType } from '@/types/OutcomePlayerType';

const createPlayer = (id: number, name: string): OutcomePlayerType['player'] => ({
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

const createOutcome = (overrides: Partial<OutcomePlayerType>): OutcomePlayerType => ({
    id: 1,
    gameDayId: 1249,
    playerId: 1,
    response: 'Yes',
    responseInterval: 123,
    points: null,
    team: null,
    comment: null,
    pub: null,
    paid: null,
    goalie: false,
    player: createPlayer(1, 'Alex Keeper'),
    ...overrides,
});

export const defaultDrinkersData: OutcomePlayerType[] = [
    createOutcome({
        id: 1,
        playerId: 1,
        team: 'A',
        pub: 1,
        player: createPlayer(1, 'Alex Keeper'),
    }),
    createOutcome({
        id: 2,
        playerId: 2,
        team: 'B',
        pub: null,
        player: createPlayer(2, 'Britt Winger'),
    }),
    createOutcome({
        id: 3,
        playerId: 3,
        team: null,
        pub: 2,
        player: createPlayer(3, 'Casey Mid'),
    }),
    createOutcome({
        id: 4,
        playerId: 4,
        team: null,
        pub: null,
        player: createPlayer(4, 'Dev Striker'),
    }),
];
