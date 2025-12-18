import { PlayerRecordDataType } from '@/types';

import { defaultPlayer } from './player';
import { defaultPlayerRecord } from './playerRecord';

export const defaultPlayerRecordData: PlayerRecordDataType = {
    ...defaultPlayerRecord,
    player: defaultPlayer,
};

export const createMockPlayerRecordData = (overrides: Partial<PlayerRecordDataType> = {}): PlayerRecordDataType => ({
    ...defaultPlayerRecordData,
    ...overrides,
});

export const defaultPlayerRecordDataList: PlayerRecordDataType[] = Array.from({ length: 20 }, (_, index) =>
    createMockPlayerRecordData({
        points: 100 - 3 * index,
    }),
);
