import type { PickerPlayerType } from '@/types/PickerPlayerType';

const createPickerPlayer = (
    id: number,
    name: string,
): PickerPlayerType['player'] => ({
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
    overrides: Partial<PickerPlayerType>,
): PickerPlayerType => ({
    id: 1,
    gameDayId: 1249,
    playerId: 1,
    response: 'Yes',
    responseInterval: 1800,
    points: null,
    team: null,
    comment: null,
    pub: 1,
    paid: false,
    goalie: false,
    gamesPlayed: 12,
    player: createPickerPlayer(1, 'Alex Keeper'),
    ...overrides,
});

export const defaultPickerAdminData: PickerPlayerType[] = [
    createMockOutcomePlayer({
        id: 1,
        playerId: 1,
        team: 'A',
        responseInterval: 1200,
        gamesPlayed: 22,
        player: createPickerPlayer(1, 'Alex Keeper'),
    }),
    createMockOutcomePlayer({
        id: 2,
        playerId: 2,
        team: 'B',
        responseInterval: 5400,
        gamesPlayed: 18,
        player: createPickerPlayer(2, 'Britt Winger'),
    }),
    createMockOutcomePlayer({
        id: 3,
        playerId: 3,
        responseInterval: 900,
        gamesPlayed: 7,
        player: createPickerPlayer(3, 'Casey Mid'),
    }),
    createMockOutcomePlayer({
        id: 4,
        playerId: 4,
        responseInterval: null,
        gamesPlayed: 3,
        player: createPickerPlayer(4, 'Dev Striker'),
    }),
];
