jest.mock('@/components/CountryFlag/CountryFlag');

import { render, screen } from '@testing-library/react';

import { PlayerCountries } from '@/components/PlayerCountries/PlayerCountries';
import { Wrapper } from '@/tests/components/lib/common';
import { defaultCountrySupporterDataList } from '@/tests/mocks';

describe('PlayerCountries', () => {
    it('renders country flags', () => {
        render(
            <Wrapper>
                <PlayerCountries countries={defaultCountrySupporterDataList} />
            </Wrapper>,
        );

        const flags = screen.getAllByText(/CountryFlag:/);
        expect(flags.length).toBeGreaterThan(0);
    });

    it('renders nothing when countries list is empty', () => {
        render(
            <Wrapper>
                <PlayerCountries countries={[]} />
            </Wrapper>,
        );

        const flags = screen.queryAllByText(/CountryFlag:/);
        expect(flags.length).toBe(0);
    });
});
