jest.mock('swr');

import { render, screen, waitFor } from '@testing-library/react';
import PlayerMugshot from 'components/PlayerMugshot';
import useSWR from 'swr';
import { Wrapper, errorText, loaderClass } from "./lib/common";

describe('PlayerMugshot', () => {
    const idOrLogin = "derekt";

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('renders loading state', async () => {
        (useSWR as jest.Mock).mockReturnValue({
            data: undefined,
            error: undefined,
            isLoading: true,
        });

        const { container } = render(<Wrapper><PlayerMugshot idOrLogin={idOrLogin} /></Wrapper>);
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

        const { container } = render(<Wrapper><PlayerMugshot idOrLogin={idOrLogin} /></Wrapper>);
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

        const { container } = render(<Wrapper><PlayerMugshot idOrLogin={idOrLogin} /></Wrapper>);
        await waitFor(() => {
            expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
            expect(screen.getByText(errorText)).toBeInTheDocument();
        });
    });

    it('renders with data', async () => {
        (useSWR as jest.Mock).mockReturnValue({
            data: {
                id: 13,
                login: "derekt",
                name: "Derek Turnipson",
            },
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><PlayerMugshot idOrLogin={idOrLogin} /></Wrapper>);
        await waitFor(() => {
            expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
            expect(screen.getByAltText("Derek Turnipson")).toHaveAttribute("src", "/api/footy/player/derekt/mugshot");
        });
    });
});
