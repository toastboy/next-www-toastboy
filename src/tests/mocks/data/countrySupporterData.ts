import { CountrySupporterDataType } from "@/types";

import { defaultCountry } from "./country";

export const defaultCountrySupporterData: CountrySupporterDataType = {
    playerId: 12,
    countryISOCode: defaultCountry.isoCode,
    country: defaultCountry,
};

export const createMockCountrySupporterData = (overrides: Partial<CountrySupporterDataType> = {}): CountrySupporterDataType => ({
    ...defaultCountrySupporterData,
    ...overrides,
});

export const defaultCountrySupporterDataList: CountrySupporterDataType[] = Array.from({ length: 100 }, (_, index) =>
    createMockCountrySupporterData({
        playerId: index % 10 + 1,
    }),
);
