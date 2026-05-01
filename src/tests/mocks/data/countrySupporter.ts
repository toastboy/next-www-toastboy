import { CountrySupporterType } from 'prisma/zod/schemas/models/CountrySupporter.schema';

export const defaultCountrySupporter = {
    playerId: 12,
    countryFIFACode: "ENG",
} satisfies CountrySupporterType;

export const invalidCountrySupporter = {
    playerId: -1,
    countryFIFACode: null as unknown as string,
} satisfies CountrySupporterType;

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
