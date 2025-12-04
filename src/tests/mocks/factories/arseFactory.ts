import { ArseType } from 'prisma/generated/schemas/models/Arse.schema';

import { defaultArse } from '@/tests/mocks/data/arse';

export const createMockArse = (overrides: Partial<ArseType> = {}): ArseType => ({
    ...defaultArse,
    ...overrides,
});
