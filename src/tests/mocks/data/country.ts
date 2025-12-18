import { CountryType } from 'prisma/zod/schemas/models/Country.schema';

export const defaultCountry: CountryType = {
    isoCode: "GB-ENG",
    name: "England",
};

export const invalidCountry: CountryType = {
    isoCode: "ZZZ",
    name: "Narnia",
};

export const createMockCountry = (overrides: Partial<CountryType> = {}): CountryType => ({
    ...defaultCountry,
    ...overrides,
});

export const defaultCountryList: CountryType[] = Array.from({ length: 4 }, (_, index) =>
    createMockCountry({
        isoCode: ["GB-ENG", "GB-NIR", "GB-SCT", "GB-WLS"][index % 4],
        name: ["England", "Northern Ireland", "Scotland", "Wales"][index % 4],
    }),
);
