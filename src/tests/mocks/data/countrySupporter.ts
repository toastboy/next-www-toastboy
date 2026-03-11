import { CountrySupporterType } from 'prisma/zod/schemas/models/CountrySupporter.schema';

export const defaultCountrySupporter: CountrySupporterType = {
    playerId: 12,
    countryFIFACode: "ENG",
};

export const createMockCountrySupporter = (overrides: Partial<CountrySupporterType> = {}): CountrySupporterType => ({
    ...defaultCountrySupporter,
    ...overrides,
});

export const defaultCountrySupporterList: CountrySupporterType[] = Array.from({ length: 100 }, (_, index) =>
    createMockCountrySupporter({
        playerId: index % 10 + 1,
        countryFIFACode: "ENG",
    }),
);
