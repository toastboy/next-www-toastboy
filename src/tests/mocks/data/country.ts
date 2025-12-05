import { CountryType } from "prisma/generated/schemas/models/Country.schema";

import { createMockCountry } from "@/tests/mocks/factories/countryFactory";

export const defaultCountry: CountryType = {
    isoCode: "GB-ENG",
    name: "Engerland",
};

export const invalidCountry: CountryType = {
    isoCode: "ZZZ",
    name: "Narnia",
};

export const defaultCountryList: CountryType[] = Array.from({ length: 4 }, (_, index) =>
    createMockCountry({
        isoCode: ["GB-ENG", "GB-NIR", "GB-SCT", "GB-WLS"][index % 4],
    }),
);
