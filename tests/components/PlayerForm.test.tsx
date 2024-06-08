import { render, screen } from '@testing-library/react';
import PlayerForm from 'components/PlayerForm';
import { Wrapper, errorText, loaderClass } from "./lib/common";
import { usePlayerForm } from 'lib/swr';

jest.mock('lib/swr');
jest.mock('components/GameDayLink', () => {
    const GameDayLink = ({ id }: { id: number }) => (
        <div>GameDayLink (id: {id})</div>
    );
    GameDayLink.displayName = 'GameDayLink';
    return GameDayLink;
});

describe('PlayerForm', () => {
    const idOrLogin = "idOrLogin";
    const games = 10;

    it('renders loading state', () => {
        (usePlayerForm as jest.Mock).mockReturnValue({
            data: undefined,
            error: undefined,
            isLoading: true,
        });

        const { container } = render(<Wrapper><PlayerForm idOrLogin={idOrLogin} games={games} /></Wrapper>);
        expect(container.querySelector(loaderClass)).toBeInTheDocument();
    });

    it('renders error state', () => {
        (usePlayerForm as jest.Mock).mockReturnValue({
            data: undefined,
            error: new Error(errorText),
            isLoading: false,
        });

        const { container } = render(<Wrapper><PlayerForm idOrLogin={idOrLogin} games={games} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText(errorText)).toBeInTheDocument();
    });

    it('renders error state when data is null', () => {
        (usePlayerForm as jest.Mock).mockReturnValue({
            data: null,
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><PlayerForm idOrLogin={idOrLogin} games={games} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText(errorText)).toBeInTheDocument();
    });

    it('renders with data', () => {
        (usePlayerForm as jest.Mock).mockReturnValue({
            data: Array.from({ length: 15 }, (_, index) => ({
                gameDayId: 1150 - index,
                points: 3 * (index % 2),
            })),
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><PlayerForm idOrLogin={idOrLogin} games={games} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText("GameDayLink (id: 1148)")).toBeInTheDocument();
    });
});
