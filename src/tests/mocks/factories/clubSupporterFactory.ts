import { ClubSupporterType } from 'prisma/generated/schemas/models/ClubSupporter.schema';

import { defaultClubSupporter } from '@/tests/mocks/data/clubSupporter';

export const createMockClubSupporter = (overrides: Partial<ClubSupporterType> = {}): ClubSupporterType => ({
    ...defaultClubSupporter,
    ...overrides,
});
