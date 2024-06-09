import { render, screen } from '@testing-library/react';
import GameDayLink from 'components/GameDayLink';
import { Wrapper, errorText, loaderClass } from "./lib/common";
import { useGameDay } from 'lib/swr';

jest.mock('lib/swr');

describe('GameDayLink', () => {
    const id = 123;

    it('renders loading state', () => {
        (useGameDay as jest.Mock).mockReturnValue({
            data: undefined,
            error: undefined,
            isLoading: true,
        });

        const { container } = render(<Wrapper><GameDayLink id={id} /></Wrapper>);
        expect(container.querySelector(loaderClass)).toBeInTheDocument();
    });

    it('renders error state', () => {
        (useGameDay as jest.Mock).mockReturnValue({
            data: undefined,
            error: new Error(errorText),
            isLoading: false,
        });

        const { container } = render(<Wrapper><GameDayLink id={id} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText(errorText)).toBeInTheDocument();
    });

    it('renders error state when data is null', () => {
        (useGameDay as jest.Mock).mockReturnValue({
            data: null,
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><GameDayLink id={id} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText(errorText)).toBeInTheDocument();
    });

    it('renders with data', () => {
        (useGameDay as jest.Mock).mockReturnValue({
            data: {
                id: 123,
                date: new Date('2021-01-01'),
            },
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><GameDayLink id={id} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByRole('link', { name: "2021-01-01" })).toHaveAttribute('href', '/footy/game/123');
    });
});
