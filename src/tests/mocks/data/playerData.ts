import type { PlayerDataDisplayType, PlayerDataEmailDisplayType } from '@/types';

import { defaultPlayer } from './player';

export const defaultPlayerData = {
    ...defaultPlayer,
    accountEmail: 'gary.login@example.com',
    extraEmails: [
        { email: 'gary.player@example.com', verified: true },
    ],
    firstResponded: 1,
    lastResponded: 100,
    firstPlayed: 5,
    lastPlayed: 95,
    gamesPlayed: 90,
    gamesWon: 50,
    gamesDrawn: 20,
    gamesLost: 20,
} satisfies PlayerDataDisplayType;

export const defaultPlayerEmailData: PlayerDataEmailDisplayType = {
    id: defaultPlayer.id,
    name: defaultPlayer.name,
    accountEmail: 'gary.login@example.com',
    extraEmails: [{ email: 'gary.player@example.com', verified: true }],
};

export const createMockPlayerData = (overrides: Partial<PlayerDataDisplayType> = {}): PlayerDataDisplayType => {
    const playerData: PlayerDataDisplayType = {
        ...defaultPlayerData,
        ...overrides,
    };

    return playerData;
};

export const defaultPlayerDataList: PlayerDataDisplayType[] = Array.from({ length: 100 }, (_, index) =>
    createMockPlayerData({
        id: index + 1,
        finished: index % 2 === 0 ? new Date("2020-01-01") : null,
    }),
);
