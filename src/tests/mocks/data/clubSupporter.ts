import { ClubSupporterType } from '@/generated/zod/schemas/models/ClubSupporter.schema';

export const defaultClubSupporter: ClubSupporterType = {
    playerId: 12,
    clubId: 2270,
};

export const createMockClubSupporter = (overrides: Partial<ClubSupporterType> = {}): ClubSupporterType => ({
    ...defaultClubSupporter,
    ...overrides,
});

export const defaultClubSupporterList: ClubSupporterType[] = Array.from({ length: 100 }, (_, index) =>
    createMockClubSupporter({
        playerId: index % 10 + 1,
        clubId: index + 1,
    }),
);
