import { PlayerRecordType } from 'prisma/generated/schemas/models/PlayerRecord.schema';

import { defaultPlayerRecord } from '@/tests/mocks/data/playerRecord';

export const createMockPlayerRecord = (overrides: Partial<PlayerRecordType> = {}): PlayerRecordType => ({
    ...defaultPlayerRecord,
    ...overrides,
});
