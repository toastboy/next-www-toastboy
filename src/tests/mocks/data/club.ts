import { ClubType } from 'prisma/zod/schemas/models/Club.schema';

export const defaultClub: ClubType = {
    id: 1,
    soccerwayId: 1000,
    clubName: "Wittering United",
    uri: "wittering-united",
    country: "england",
};

export const invalidClub: ClubType = {
    ...defaultClub,
    id: -1,
};

export const createMockClub = (overrides: Partial<ClubType> = {}): ClubType => ({
    ...defaultClub,
    ...overrides,
});

export const defaultClubList: ClubType[] = Array.from({ length: 100 }, (_, index) =>
    createMockClub({
        id: index + 1,
        soccerwayId: 1000 + index,
    }),
);
