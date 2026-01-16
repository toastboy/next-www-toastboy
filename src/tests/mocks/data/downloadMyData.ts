import type { DownloadMyDataPayload } from '@/components/DownloadMyData/DownloadMyData';

import { defaultClubSupporterDataList } from './clubSupporterData';
import { defaultCountrySupporterDataList } from './countrySupporterData';
import { defaultOutcome } from './outcome';
import { defaultPlayer } from './player';
import { defaultPlayerExtraEmails } from './playerExtraEmail';

export const defaultDownloadMyDataPayload: DownloadMyDataPayload = {
    meta: {
        exportedAt: '2024-01-01T12:00:00.000Z',
        playerId: defaultPlayer.id,
        userEmail: 'gary.player@example.com',
    },
    profile: defaultPlayer,
    extraEmails: defaultPlayerExtraEmails,
    countries: defaultCountrySupporterDataList,
    clubs: defaultClubSupporterDataList,
    totals: {
        accountEmail: 'gary.player@example.com',
        firstResponded: 1,
        lastResponded: 12,
        firstPlayed: 2,
        lastPlayed: 10,
        gamesPlayed: 9,
        gamesWon: 5,
        gamesDrawn: 2,
        gamesLost: 2,
    },
    outcomes: [defaultOutcome],
};

export const createMockDownloadMyDataPayload = (
    overrides: Partial<DownloadMyDataPayload> = {},
): DownloadMyDataPayload => ({
    ...defaultDownloadMyDataPayload,
    ...overrides,
});
