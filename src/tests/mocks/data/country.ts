import { CountryType } from 'prisma/zod/schemas/models/Country.schema';

export const defaultCountry: CountryType = {
    fifaCode: "ENG",
    name: "England",
};

export const invalidCountry: CountryType = {
    fifaCode: "ZZZ",
    name: "Narnia",
};

export const createMockCountry = (overrides: Partial<CountryType> = {}): CountryType => ({
    ...defaultCountry,
    ...overrides,
});

export const defaultCountryList: CountryType[] = Array.from({ length: 4 }, (_, index) =>
    createMockCountry({
        fifaCode: ["ENG", "NIR", "SCO", "WAL"][index % 4],
        name: ["England", "Northern Ireland", "Scotland", "Wales"][index % 4],
    }),
);
