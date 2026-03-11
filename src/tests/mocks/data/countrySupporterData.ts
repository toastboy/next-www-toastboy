import { CountrySupporterDataType } from '@/types';

import { defaultCountry, defaultCountryList } from './country';

export const defaultCountrySupporterData: CountrySupporterDataType = {
    playerId: 12,
    countryFIFACode: defaultCountry.fifaCode,
    country: defaultCountry,
};

export const createMockCountrySupporterData = (overrides: Partial<CountrySupporterDataType> = {}): CountrySupporterDataType => ({
    ...defaultCountrySupporterData,
    ...overrides,
});

export const defaultCountrySupporterDataList: CountrySupporterDataType[] = Array.from({ length: 2 }, (_, index) =>
    createMockCountrySupporterData({
        playerId: index % 10 + 1,
        countryFIFACode: defaultCountryList[index].fifaCode,
        country: defaultCountryList[index],
    }),
);
