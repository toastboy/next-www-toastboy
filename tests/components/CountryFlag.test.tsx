import { render, screen } from '@testing-library/react';
import CountryFlag from 'components/CountryFlag';
import { useCountry } from 'lib/swr';
import { Wrapper, errorText, loaderClass } from "./lib/common";

jest.mock('lib/swr');

describe('CountryFlag', () => {
    const isoCode = "NG";

    it('renders loading state', () => {
        (useCountry as jest.Mock).mockReturnValue({
            data: undefined,
            error: undefined,
            isLoading: true,
        });

        const { container } = render(<Wrapper><CountryFlag isoCode={isoCode} /></Wrapper>);
        expect(container.querySelector(loaderClass)).toBeInTheDocument();
    });

    it('renders error state', () => {
        (useCountry as jest.Mock).mockReturnValue({
            data: undefined,
            error: new Error(errorText),
            isLoading: false,
        });

        const { container } = render(<Wrapper><CountryFlag isoCode={isoCode} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText(errorText)).toBeInTheDocument();
    });

    it('renders error state when data is null', () => {
        (useCountry as jest.Mock).mockReturnValue({
            data: null,
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><CountryFlag isoCode={isoCode} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText(errorText)).toBeInTheDocument();
    });

    it('renders with data', () => {
        (useCountry as jest.Mock).mockReturnValue({
            data: {
                isoCode: "NG",
                name: "Nigeria",
            },
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><CountryFlag isoCode={isoCode} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByAltText("Nigeria")).toHaveAttribute("src", "/api/footy/country/ng/flag");
    });
});
