import { PlayerLoginType } from 'prisma/zod/schemas/models/PlayerLogin.schema';

import type { PlayerDisplayType } from '@/services/Player';

export const defaultPlayer: PlayerDisplayType = {
    id: 1,
    name: "Gary Player",
    joined: new Date("2021-01-01"),
    finished: null,
    born: 1975,
    introducedBy: 23,
    comment: null,
    anonymous: false,
};

export const invalidPlayer: PlayerDisplayType = {
    ...defaultPlayer,
    id: -1,
};

export const createMockPlayer = (overrides: Partial<PlayerDisplayType> = {}): PlayerDisplayType => ({
    ...defaultPlayer,
    ...overrides,
});

export const defaultPlayerList: PlayerDisplayType[] = Array.from({ length: 100 }, (_, index) =>
    createMockPlayer({
        id: index + 1,
        finished: index % 2 === 0 ? new Date("2020-01-01") : null,
    }),
);

export const defaultPlayerLogin: PlayerLoginType = {
    playerId: 1,
    login: 'garyp',
};

export const defaultPlayerLoginList: PlayerLoginType[] = defaultPlayerList.map((player) => ({
    playerId: player.id,
    login: player.id === 1 ? 'garyp' : `player${player.id}`,
}));
