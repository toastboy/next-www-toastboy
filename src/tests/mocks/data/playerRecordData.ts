import { PlayerRecordDataType } from '@/types';

import { defaultPlayer, defaultPlayerList } from './player';
import { defaultPlayerRecord } from './playerRecord';

export const defaultPlayerRecordData = {
    ...defaultPlayerRecord,
    player: defaultPlayer,
} satisfies PlayerRecordDataType;

export const createMockPlayerRecordData = (
    overrides: Partial<PlayerRecordDataType> = {},
): PlayerRecordDataType => ({
    ...defaultPlayerRecordData,
    ...overrides,
});

/**
 * Note: The first record matches defaultPlayerRecordData (same id and
 * player) for backward compatibility.
 */
export const defaultPlayerRecordDataList: PlayerRecordDataType[] = [
    createMockPlayerRecordData({ points: 100 }),
    ...Array.from({ length: 19 }, (_, i) => {
        const index = i + 1;
        const player = defaultPlayerList[index];

        return createMockPlayerRecordData({
            id: index + 1,
            playerId: player.id,
            player,
            points: 100 - 3 * index,
        });
    }),
];
