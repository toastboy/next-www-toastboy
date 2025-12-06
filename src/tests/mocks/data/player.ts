import { PlayerType } from 'prisma/generated/schemas/models/Player.schema';

export const defaultPlayer: PlayerType = {
    id: 1,
    isAdmin: false,
    login: "garyp",
    name: "Gary Player",
    email: "gary.player@example.com",
    joined: new Date("2021-01-01"),
    finished: null,
    born: new Date("1975-11-01"),
    introducedBy: 23,
    comment: null,
    anonymous: false,
};

export const invalidPlayer: PlayerType = {
    ...defaultPlayer,
    id: -1,
};

export const createMockPlayer = (overrides: Partial<PlayerType> = {}): PlayerType => ({
    ...defaultPlayer,
    ...overrides,
});

export const defaultPlayerList: PlayerType[] = Array.from({ length: 100 }, (_, index) =>
    createMockPlayer({
        id: index + 1,
        finished: index % 2 === 0 ? new Date("2020-01-01") : null,
    }),
);
