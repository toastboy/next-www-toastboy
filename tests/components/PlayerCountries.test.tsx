jest.mock('swr');

import { render, screen, waitFor } from '@testing-library/react';
import PlayerCountries from 'components/PlayerCountries';
import useSWR from 'swr';
import { Wrapper, errorText, loaderClass } from "./lib/common";

jest.mock('components/CountryFlag', () => {
    const CountryFlag = ({ isoCode }: { isoCode: string }) => (
        <div>CountryFlag (isoCode: {isoCode})</div>
    );
    CountryFlag.displayName = 'CountryFlag';
    return CountryFlag;
});

describe('PlayerCountries', () => {
    const idOrLogin = "160";

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('renders loading state', async () => {
        (useSWR as jest.Mock).mockReturnValue({
            data: undefined,
            error: undefined,
            isLoading: true,
        });

        const { container } = render(<Wrapper><PlayerCountries idOrLogin={idOrLogin} /></Wrapper>);
        await waitFor(() => {
            expect(container.querySelector(loaderClass)).toBeInTheDocument();
        });
    });

    it('renders error state', async () => {
        (useSWR as jest.Mock).mockReturnValue({
            data: undefined,
            error: new Error(errorText),
            isLoading: false,
        });

        const { container } = render(<Wrapper><PlayerCountries idOrLogin={idOrLogin} /></Wrapper>);
        await waitFor(() => {
            expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
            expect(screen.getByText(errorText)).toBeInTheDocument();
        });
    });

    it('renders error state when data is null', async () => {
        (useSWR as jest.Mock).mockReturnValue({
            data: null,
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><PlayerCountries idOrLogin={idOrLogin} /></Wrapper>);
        await waitFor(() => {
            expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
            expect(screen.getByText(errorText)).toBeInTheDocument();
        });
    });

    it('renders with data', async () => {
        (useSWR as jest.Mock).mockReturnValue({
            data: ["NG", "FR"],
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><PlayerCountries idOrLogin={idOrLogin} /></Wrapper>);
        await waitFor(() => {
            expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
            expect(screen.getByText("CountryFlag (isoCode: NG)")).toBeInTheDocument();
            expect(screen.getByText("CountryFlag (isoCode: FR)")).toBeInTheDocument();
        });
    });
});
