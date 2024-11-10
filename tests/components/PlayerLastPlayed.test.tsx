jest.mock('swr');

import { render, screen, waitFor } from '@testing-library/react';
import PlayerLastPlayed from 'components/PlayerLastPlayed';
import useSWR from 'swr';
import { Wrapper, errorText, loaderClass } from "./lib/common";

jest.mock('components/GameDayLink', () => {
    const GameDayLink = ({ id }: { id: number }) => (
        <div>GameDayLink (id: {id})</div>
    );
    GameDayLink.displayName = 'GameDayLink';
    return GameDayLink;
});

describe('PlayerLastPlayed', () => {
    const idOrLogin = "15";

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('renders loading state', async () => {
        (useSWR as jest.Mock).mockReturnValue({
            data: undefined,
            error: undefined,
            isLoading: true,
        });

        const { container } = render(<Wrapper><PlayerLastPlayed idOrLogin={idOrLogin} /></Wrapper>);
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

        const { container } = render(<Wrapper><PlayerLastPlayed idOrLogin={idOrLogin} /></Wrapper>);
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

        const { container } = render(<Wrapper><PlayerLastPlayed idOrLogin={idOrLogin} /></Wrapper>);
        await waitFor(() => {
            expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
            expect(screen.getByText(errorText)).toBeInTheDocument();
        });
    });

    it('renders with data', async () => {
        (useSWR as jest.Mock).mockReturnValue({
            data: {
                gameDayId: 1150,
            },
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><PlayerLastPlayed idOrLogin={idOrLogin} /></Wrapper>);
        await waitFor(() => {
            expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
            expect(screen.getByText("GameDayLink (id: 1150)")).toBeInTheDocument();
        });
    });
});
