import { render, screen } from '@testing-library/react';
import PlayerMugshot from 'components/PlayerMugshot';
import { usePlayer } from 'lib/swr';
import { Wrapper, errorText, loaderClass } from "./lib/common";

jest.mock('lib/swr');

describe('PlayerMugshot', () => {
    const idOrLogin = "derekt";

    it('renders loading state', () => {
        (usePlayer as jest.Mock).mockReturnValue({
            data: undefined,
            error: undefined,
            isLoading: true,
        });

        const { container } = render(<Wrapper><PlayerMugshot idOrLogin={idOrLogin} /></Wrapper>);
        expect(container.querySelector(loaderClass)).toBeInTheDocument();
    });

    it('renders error state', () => {
        (usePlayer as jest.Mock).mockReturnValue({
            data: undefined,
            error: new Error(errorText),
            isLoading: false,
        });

        const { container } = render(<Wrapper><PlayerMugshot idOrLogin={idOrLogin} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText(errorText)).toBeInTheDocument();
    });

    it('renders error state when data is null', () => {
        (usePlayer as jest.Mock).mockReturnValue({
            data: null,
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><PlayerMugshot idOrLogin={idOrLogin} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText(errorText)).toBeInTheDocument();
    });

    it('renders with data', () => {
        (usePlayer as jest.Mock).mockReturnValue({
            data: {
                id: 13,
                login: "derekt",
                name: "Derek Turnipson",
            },
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><PlayerMugshot idOrLogin={idOrLogin} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByAltText("Derek Turnipson")).toHaveAttribute("src", "/api/footy/player/derekt/mugshot");
    });
});
