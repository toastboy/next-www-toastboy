import { GameDayType } from 'prisma/generated/schemas/models/GameDay.schema';

import { defaultGameDay } from '@/tests/mocks/data/gameDay';

export const createMockGameDay = (overrides: Partial<GameDayType> = {}): GameDayType => ({
    ...defaultGameDay,
    ...overrides,
});
