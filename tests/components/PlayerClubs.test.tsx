jest.mock('swr');

import { render, screen, waitFor } from '@testing-library/react';
import PlayerClubs from 'components/PlayerClubs/PlayerClubs';
import useSWR from 'swr';
import { Wrapper, errorText, loaderClass } from "./lib/common";

jest.mock('components/ClubBadge/ClubBadge');

describe('PlayerClubs', () => {
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

        const { container } = render(<Wrapper><PlayerClubs idOrLogin={idOrLogin} /></Wrapper>);
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

        const { container } = render(<Wrapper><PlayerClubs idOrLogin={idOrLogin} /></Wrapper>);
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

        const { container } = render(<Wrapper><PlayerClubs idOrLogin={idOrLogin} /></Wrapper>);
        await waitFor(() => {
            expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
            expect(screen.getByText(errorText)).toBeInTheDocument();
        });
    });

    it('renders with data', async () => {
        (useSWR as jest.Mock).mockReturnValue({
            data: [1000, 2000],
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><PlayerClubs idOrLogin={idOrLogin} /></Wrapper>);
        await waitFor(() => {
            expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
            expect(screen.getByText("ClubBadge (clubId: 1000)")).toBeInTheDocument();
            expect(screen.getByText("ClubBadge (clubId: 2000)")).toBeInTheDocument();
        });
    });
});
