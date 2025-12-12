import { PlayerDataType } from '@/types';

import { defaultPlayer } from './player';

export const defaultPlayerData: PlayerDataType = {
    ...defaultPlayer,
    firstResponded: 1,
    lastResponded: 100,
    firstPlayed: 5,
    lastPlayed: 95,
    gamesPlayed: 90,
    gamesWon: 50,
    gamesDrawn: 20,
    gamesLost: 20,
};

export const createMockPlayerData = (overrides: Partial<PlayerDataType> = {}): PlayerDataType => ({
    ...defaultPlayerData,
    ...overrides,
});

export const defaultPlayerDataList: PlayerDataType[] = Array.from({ length: 100 }, (_, index) =>
    createMockPlayerData({
        id: index + 1,
        finished: index % 2 === 0 ? new Date("2020-01-01") : null,
    }),
);
