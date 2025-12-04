import { PlayerType } from 'prisma/generated/schemas/models/Player.schema';

import { defaultPlayer } from '@/tests/mocks/data/player';

export const createMockPlayer = (overrides: Partial<PlayerType> = {}): PlayerType => ({
    ...defaultPlayer,
    ...overrides,
});
