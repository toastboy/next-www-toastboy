jest.mock('services/Country', () => ({
    __esModule: true,
    default: { get: jest.fn() },
}));

import { render, screen } from '@testing-library/react';
import CountryFlag, { Props } from 'components/CountryFlag/CountryFlag';
import countryService from 'services/Country';

import { Wrapper } from './lib/common';

describe('CountryFlag', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('renders flag image when country exists', async () => {
        (countryService.get as jest.Mock).mockResolvedValueOnce({
            isoCode: 'GB',
            name: 'United Kingdom',
        });

        // Call the async component function directly to resolve its content before rendering.
        const element = await CountryFlag({ countryISOCode: 'GB' } as Props);
        render(<Wrapper>{element}</Wrapper>);

        const img = screen.getByRole('img', { name: 'United Kingdom' });
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', '/api/footy/country/gb/flag');
        expect(img).toHaveAttribute('alt', 'United Kingdom');
        expect(img).toHaveAttribute('title', 'United Kingdom');
        expect(countryService.get).toHaveBeenCalledWith('GB');
    });

    it('renders nothing when country does not exist', async () => {
        (countryService.get as jest.Mock).mockResolvedValueOnce(null);

        const element = await CountryFlag({ countryISOCode: 'ZZ' } as Props);
        render(<Wrapper>{element}</Wrapper>);

        expect(screen.queryByRole('img')).not.toBeInTheDocument();
        expect(countryService.get).toHaveBeenCalledWith('ZZ');
    });
});
