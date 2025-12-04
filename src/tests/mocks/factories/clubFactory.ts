import { ClubType } from 'prisma/generated/schemas/models/Club.schema';

import { defaultClub } from '@/tests/mocks/data/club';

export const createMockClub = (overrides: Partial<ClubType> = {}): ClubType => ({
    ...defaultClub,
    ...overrides,
});
