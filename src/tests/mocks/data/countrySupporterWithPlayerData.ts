import { CountrySupporterWithPlayerDataType } from '@/types';

import { defaultCountryList } from './country';
import { createMockPlayer, defaultPlayer } from './player';

/** Default mock country-supporter entry enriched with player data. */
export const defaultCountrySupporterWithPlayerData: CountrySupporterWithPlayerDataType = {
    playerId: defaultPlayer.id,
    countryFIFACode: defaultCountryList[0].fifaCode,
    country: defaultCountryList[0],
    player: defaultPlayer,
};

/** Factory for creating mock country-supporter-with-player entries. */
export const createMockCountrySupporterWithPlayerData = (
    overrides: Partial<CountrySupporterWithPlayerDataType> = {},
): CountrySupporterWithPlayerDataType => ({
    ...defaultCountrySupporterWithPlayerData,
    ...overrides,
});

/**
 * Default list of country-supporter entries with player data, covering the
 * four UK home nations to exercise the name-mapping and grouping logic.
 */
export const defaultCountrySupporterWithPlayerDataList: CountrySupporterWithPlayerDataType[] =
    defaultCountryList.map((country, index) =>
        createMockCountrySupporterWithPlayerData({
            playerId: index + 1,
            countryFIFACode: country.fifaCode,
            country,
            player: createMockPlayer({ id: index + 1, name: `Player ${index + 1}` }),
        }),
    );
