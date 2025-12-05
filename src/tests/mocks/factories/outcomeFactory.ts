import { OutcomeType } from 'prisma/generated/schemas/models/Outcome.schema';

import { defaultOutcome } from '@/tests/mocks/data/outcome';

export const createMockOutcome = (overrides: Partial<OutcomeType> = {}): OutcomeType => ({
    ...defaultOutcome,
    ...overrides,
});
