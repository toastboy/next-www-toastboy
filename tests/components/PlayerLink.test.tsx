import { render, screen } from '@testing-library/react';
import PlayerLink from 'components/PlayerLink';
import { Wrapper, errorText, loaderClass } from "./lib/common";
import { usePlayer } from 'lib/swr';

jest.mock('lib/swr');

describe('PlayerLink', () => {
    const idOrLogin = "derekt";

    it('renders loading state', () => {
        (usePlayer as jest.Mock).mockReturnValue({
            data: undefined,
            error: undefined,
            isLoading: true,
        });

        const { container } = render(<Wrapper><PlayerLink idOrLogin={idOrLogin} /></Wrapper>);
        expect(container.querySelector(loaderClass)).toBeInTheDocument();
    });

    it('renders error state', () => {
        (usePlayer as jest.Mock).mockReturnValue({
            data: undefined,
            error: new Error(errorText),
            isLoading: false,
        });

        const { container } = render(<Wrapper><PlayerLink idOrLogin={idOrLogin} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText(errorText)).toBeInTheDocument();
    });

    it('renders error state when data is null', () => {
        (usePlayer as jest.Mock).mockReturnValue({
            data: null,
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><PlayerLink idOrLogin={idOrLogin} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText(errorText)).toBeInTheDocument();
    });

    it('renders with data', () => {
        (usePlayer as jest.Mock).mockReturnValue({
            data: {
                login: "derekt",
                name: "Derek Turnipson",
            },
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><PlayerLink idOrLogin={idOrLogin} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByRole('link', { name: "Derek Turnipson" })).toHaveAttribute('href', '/footy/player/derekt');
    });
});
