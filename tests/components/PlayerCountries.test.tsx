import { render, screen } from '@testing-library/react';
import PlayerCountries from 'components/PlayerCountries';
import { Wrapper, errorText, loaderClass } from "./lib/common";
import { usePlayerCountries } from 'lib/swr';

jest.mock('lib/swr');
jest.mock('components/CountryFlag', () => {
    const CountryFlag = ({ isoCode }: { isoCode: string }) => (
        <div>CountryFlag (isoCode: {isoCode})</div>
    );
    CountryFlag.displayName = 'CountryFlag';
    return CountryFlag;
});

describe('PlayerCountries', () => {
    const idOrLogin = "160";

    it('renders loading state', () => {
        (usePlayerCountries as jest.Mock).mockReturnValue({
            data: undefined,
            error: undefined,
            isLoading: true,
        });

        const { container } = render(<Wrapper><PlayerCountries idOrLogin={idOrLogin} /></Wrapper>);
        expect(container.querySelector(loaderClass)).toBeInTheDocument();
    });

    it('renders error state', () => {
        (usePlayerCountries as jest.Mock).mockReturnValue({
            data: undefined,
            error: new Error(errorText),
            isLoading: false,
        });

        const { container } = render(<Wrapper><PlayerCountries idOrLogin={idOrLogin} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText(errorText)).toBeInTheDocument();
    });

    it('renders error state when data is null', () => {
        (usePlayerCountries as jest.Mock).mockReturnValue({
            data: null,
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><PlayerCountries idOrLogin={idOrLogin} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText(errorText)).toBeInTheDocument();
    });

    it('renders with data', () => {
        (usePlayerCountries as jest.Mock).mockReturnValue({
            data: ["NG", "FR"],
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><PlayerCountries idOrLogin={idOrLogin} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText("CountryFlag (isoCode: NG)")).toBeInTheDocument();
        expect(screen.getByText("CountryFlag (isoCode: FR)")).toBeInTheDocument();
    });
});
