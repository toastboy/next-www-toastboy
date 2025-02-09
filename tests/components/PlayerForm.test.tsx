jest.mock('swr');

import { render, screen, waitFor } from '@testing-library/react';
import PlayerForm from 'components/PlayerForm/PlayerForm';
import useSWR from 'swr';
import { Wrapper, errorText, loaderClass } from "./lib/common";

jest.mock('components/GameDayLink/GameDayLink');

describe('PlayerForm', () => {
    const idOrLogin = "idOrLogin";
    const games = 10;

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('renders loading state', async () => {
        (useSWR as jest.Mock).mockReturnValue({
            data: undefined,
            error: undefined,
            isLoading: true,
        });

        const { container } = render(<Wrapper><PlayerForm idOrLogin={idOrLogin} games={games} /></Wrapper>);
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

        const { container } = render(<Wrapper><PlayerForm idOrLogin={idOrLogin} games={games} /></Wrapper>);
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

        const { container } = render(<Wrapper><PlayerForm idOrLogin={idOrLogin} games={games} /></Wrapper>);
        await waitFor(() => {
            expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
            expect(screen.getByText(errorText)).toBeInTheDocument();
        });
    });

    it('renders with data', async () => {
        (useSWR as jest.Mock).mockReturnValue({
            data: Array.from({ length: 15 }, (_, index) => ({
                gameDayId: 1150 - index,
                points: 3 * (index % 2),
            })),
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><PlayerForm idOrLogin={idOrLogin} games={games} /></Wrapper>);
        await waitFor(() => {
            expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
            expect(screen.getByText("GameDayLink (id: 1148)")).toBeInTheDocument();
        });
    });
});
