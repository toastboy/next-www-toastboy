import { render, screen } from '@testing-library/react';
import PlayerLastPlayed from 'components/PlayerLastPlayed';
import { Wrapper, errorText, loaderClass } from "./lib/common";
import { usePlayerLastPlayed } from 'lib/swr';

jest.mock('lib/swr');
jest.mock('components/GameDayLink', () => {
    const GameDayLink = ({ id }: { id: number }) => (
        <div>GameDayLink (id: {id})</div>
    );
    GameDayLink.displayName = 'GameDayLink';
    return GameDayLink;
});

describe('PlayerLastPlayed', () => {
    const idOrLogin = "15";

    it('renders loading state', () => {
        (usePlayerLastPlayed as jest.Mock).mockReturnValue({
            data: undefined,
            error: undefined,
            isLoading: true,
        });

        const { container } = render(<Wrapper><PlayerLastPlayed idOrLogin={idOrLogin} /></Wrapper>);
        expect(container.querySelector(loaderClass)).toBeInTheDocument();
    });

    it('renders error state', () => {
        (usePlayerLastPlayed as jest.Mock).mockReturnValue({
            data: undefined,
            error: new Error(errorText),
            isLoading: false,
        });

        const { container } = render(<Wrapper><PlayerLastPlayed idOrLogin={idOrLogin} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText(errorText)).toBeInTheDocument();
    });

    it('renders error state when data is null', () => {
        (usePlayerLastPlayed as jest.Mock).mockReturnValue({
            data: null,
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><PlayerLastPlayed idOrLogin={idOrLogin} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText(errorText)).toBeInTheDocument();
    });

    it('renders with data', () => {
        (usePlayerLastPlayed as jest.Mock).mockReturnValue({
            data: {
                gameDayId: 1150,
            },
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><PlayerLastPlayed idOrLogin={idOrLogin} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText("GameDayLink (id: 1150)")).toBeInTheDocument();
    });
});
