jest.mock('swr');

import { render, screen, waitFor } from '@testing-library/react';
import GameDayLink from 'components/GameDayLink';
import useSWR from 'swr';
import { Wrapper, errorText, loaderClass } from "./lib/common";

describe('GameDayLink', () => {
    const id = 123;

    it('renders loading state', async () => {
        (useSWR as jest.Mock).mockReturnValue({
            data: undefined,
            error: undefined,
            isLoading: true,
        });

        const { container } = render(<Wrapper><GameDayLink id={id} /></Wrapper>);
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

        const { container } = render(<Wrapper><GameDayLink id={id} /></Wrapper>);
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

        const { container } = render(<Wrapper><GameDayLink id={id} /></Wrapper>);
        await waitFor(() => {
            expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
            expect(screen.getByText(errorText)).toBeInTheDocument();
        });
    });

    it('renders with data', async () => {
        (useSWR as jest.Mock).mockReturnValue({
            data: {
                id: 123,
                date: new Date('2021-01-01'),
            },
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><GameDayLink id={id} /></Wrapper>);
        await waitFor(() => {
            expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
            expect(screen.getByRole('link', { name: "2021-01-01" })).toHaveAttribute('href', '/footy/game/123');
        });
    });
});
