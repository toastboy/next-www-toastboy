import { CountrySupporterType } from 'prisma/generated/schemas/models/CountrySupporter.schema';

import { defaultCountrySupporter } from '@/tests/mocks/data/countrySupporter';

export const createMockCountrySupporter = (overrides: Partial<CountrySupporterType> = {}): CountrySupporterType => ({
    ...defaultCountrySupporter,
    ...overrides,
});
