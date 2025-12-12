jest.mock('services/Country', () => ({
    __esModule: true,
    default: { get: jest.fn() },
}));

import { render, screen } from '@testing-library/react';

import { CountryFlag } from '@/components/CountryFlag/CountryFlag';

import { defaultCountry } from '../mocks';
import { Wrapper } from './lib/common';

describe('CountryFlag', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('renders flag image when country exists', () => {
        render(<Wrapper><CountryFlag country={defaultCountry} /></Wrapper>);

        const img = screen.getByRole('img', { name: defaultCountry.name });
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', `/api/footy/country/${defaultCountry.isoCode.toLowerCase()}/flag`);
        expect(img).toHaveAttribute('alt', defaultCountry.name);
        expect(img).toHaveAttribute('title', defaultCountry.name);
    });
});
