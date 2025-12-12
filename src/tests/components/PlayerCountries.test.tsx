jest.mock('components/CountryFlag/CountryFlag', () => {
    const MockCountryFlag = () => <div data-testid="mock-country-flag" />;
    MockCountryFlag.displayName = 'MockCountryFlag';
    return MockCountryFlag;
});

import { render, screen } from '@testing-library/react';

import PlayerCountries from '@/components/PlayerCountries/PlayerCountries';
import { defaultCountrySupporterDataList } from '@/tests/mocks';

import { Wrapper } from './lib/common';

describe('PlayerCountries', () => {
    it('renders country flags', () => {
        render(
            <Wrapper>
                <PlayerCountries countries={defaultCountrySupporterDataList} />
            </Wrapper>,
        );

        const flags = screen.getAllByTestId('mock-country-flag');
        expect(flags.length).toBeGreaterThan(0);
    });

    it('renders nothing when countries list is empty', () => {
        const { container } = render(
            <Wrapper>
                <PlayerCountries countries={[]} />
            </Wrapper>,
        );

        expect(container.firstChild).toBeEmptyDOMElement();
    });
});
