import { PlayerDataType } from '@/types';

import { defaultPlayer } from './player';

export const defaultPlayerData: PlayerDataType = {
    ...defaultPlayer,
    accountEmail: 'gary.login@example.com',
    extraEmails: [
        {
            id: 1,
            playerId: 1,
            email: 'gary.player@example.com',
            verifiedAt: new Date('2021-01-01'),
            createdAt: new Date('2021-01-01'),
        },
    ],
    firstResponded: 1,
    lastResponded: 100,
    firstPlayed: 5,
    lastPlayed: 95,
    gamesPlayed: 90,
    gamesWon: 50,
    gamesDrawn: 20,
    gamesLost: 20,
};

export const createMockPlayerData = (overrides: Partial<PlayerDataType> = {}): PlayerDataType => {
    const playerData: PlayerDataType = {
        ...defaultPlayerData,
        ...overrides,
    };

    if (!overrides.extraEmails) {
        playerData.extraEmails = playerData.extraEmails.map((email) => ({
            ...email,
            playerId: playerData.id,
        }));
    }

    return playerData;
};

export const defaultPlayerDataList: PlayerDataType[] = Array.from({ length: 100 }, (_, index) =>
    createMockPlayerData({
        id: index + 1,
        finished: index % 2 === 0 ? new Date("2020-01-01") : null,
    }),
);
