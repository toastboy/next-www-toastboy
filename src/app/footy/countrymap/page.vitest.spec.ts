import { renderToStaticMarkup } from 'react-dom/server';
import type { Mock } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('services/CountrySupporter');

vi.mock('@mantine/core', () => ({
    Paper: ({ children }: { children?: unknown }) => children,
    Text: ({ children }: { children?: unknown }) => children,
    Title: ({ children }: { children?: unknown }) => children,
}));

vi.mock('@/components/PlayerCountryMap/PlayerCountryMap', () => ({
    PlayerCountryMap: vi.fn(() => null),
}));

import CountryMapPage from '@/app/footy/countrymap/page';
import { PlayerCountryMap } from '@/components/PlayerCountryMap/PlayerCountryMap';
import countrySupporterService from '@/services/CountrySupporter';
import { defaultCountrySupporterWithPlayerDataList } from '@/tests/mocks/data/countrySupporterWithPlayerData';

describe('CountryMap page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (countrySupporterService.getAllWithCountryAndPlayer as Mock).mockResolvedValue(
            defaultCountrySupporterWithPlayerDataList,
        );
    });

    it('calls countrySupporterService.getAllWithCountryAndPlayer', async () => {
        await CountryMapPage();

        expect(countrySupporterService.getAllWithCountryAndPlayer).toHaveBeenCalledTimes(1);
    });

    it('passes the countries data to the PlayerCountryMap component', async () => {
        const element = await CountryMapPage();
        renderToStaticMarkup(element);

        expect(PlayerCountryMap).toHaveBeenCalledWith(
            { countries: defaultCountrySupporterWithPlayerDataList },
            undefined,
        );
    });

    it('handles service errors gracefully', async () => {
        (countrySupporterService.getAllWithCountryAndPlayer as Mock).mockRejectedValue(new Error('DB failed'));

        await expect(CountryMapPage()).rejects.toThrow('DB failed');
    });
});
