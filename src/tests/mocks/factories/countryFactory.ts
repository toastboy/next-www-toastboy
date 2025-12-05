import { CountryType } from 'prisma/generated/schemas/models/Country.schema';

import { defaultCountry } from '@/tests/mocks/data/country';

export const createMockCountry = (overrides: Partial<CountryType> = {}): CountryType => ({
    ...defaultCountry,
    ...overrides,
});
