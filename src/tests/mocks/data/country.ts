import { CountryType } from "prisma/generated/schemas/models/Country.schema";

export const defaultCountry: CountryType = {
    isoCode: "GB-ENG",
    name: "Engerland",
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
    }),
);
