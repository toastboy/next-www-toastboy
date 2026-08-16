import { render, screen } from '@testing-library/react';

import { CountryMapShell } from '@/components/CountryMapShell/CountryMapShell';
import { extractMockProps, Wrapper } from '@/tests/components/lib/common';
import { createMockCountry } from '@/tests/mocks/data/country';
import { createMockCountrySupporterWithPlayerData } from '@/tests/mocks/data/countrySupporterWithPlayerData';

vi.mock('@/components/PlayerCountryMap/PlayerCountryMap');

describe('CountryMapShell', () => {
    it('renders the heading and the unique country count, and passes countries through', () => {
        const england = createMockCountry({
            fifaCode: 'ENG',
            name: 'England',
        });
        const france = createMockCountry({ fifaCode: 'FRA', name: 'France' });
        const countries = [
            createMockCountrySupporterWithPlayerData({ country: england }),
            createMockCountrySupporterWithPlayerData({ country: france }),
            createMockCountrySupporterWithPlayerData({ country: england }),
        ];

        render(
            <Wrapper>
                <CountryMapShell countries={countries} />
            </Wrapper>,
        );

        expect(
            screen.getByRole('heading', { name: 'Toastboy FC World Map' }),
        ).toBeInTheDocument();
        expect(
            screen.getByText(/highlights the 2 different/),
        ).toBeInTheDocument();

        const [props] = extractMockProps<{ countries: unknown }>(
            'PlayerCountryMap',
        );
        expect(props.countries).toEqual(JSON.parse(JSON.stringify(countries)));
    });
});
