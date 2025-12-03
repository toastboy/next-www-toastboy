import { PlayerType } from 'prisma/generated/schemas/models/Player.schema';

import { defaultPlayer } from '../data/player';

export const createMockPlayer = (overrides: Partial<PlayerType> = {}): PlayerType => ({
    ...defaultPlayer,
    id: Math.floor(Math.random() * 100000) + 1,
    ...overrides,
});
