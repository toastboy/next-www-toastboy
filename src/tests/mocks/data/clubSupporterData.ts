import { ClubSupporterDataType } from '@/types';

import { defaultClub } from './club';

export const defaultClubSupporterData: ClubSupporterDataType = {
    playerId: 12,
    clubId: 2270,
    club: defaultClub,
};

export const createMockClubSupporterData = (overrides: Partial<ClubSupporterDataType> = {}): ClubSupporterDataType => ({
    ...defaultClubSupporterData,
    ...overrides,
});

export const defaultClubSupporterDataList: ClubSupporterDataType[] = Array.from({ length: 2 }, (_, index) =>
    createMockClubSupporterData({
        playerId: index % 10 + 1,
        clubId: index + 1,
    }),
);
