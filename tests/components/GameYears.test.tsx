jest.mock('swr');

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import GameYears from 'components/GameYears/GameYears';
import useSWR from 'swr';
import { Wrapper, errorText, loaderClass } from "./lib/common";

jest.mock('@mantine/core', () => {
    return {
        ...jest.requireActual('@mantine/core'),
        FloatingIndicator: ({ children }: { children: React.ReactNode }) => (
            <div data-testid="mock-floating-indicator">{children}</div>
        ),
    };
});

describe('GameYears', () => {
    const year = 2001;

    it('renders loading state', async () => {
        (useSWR as jest.Mock).mockReturnValue({
            data: undefined,
            error: undefined,
            isLoading: true,
        });

        const { container } = render(<Wrapper><GameYears activeYear={year} onYearChange={() => { }} /></Wrapper>);
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

        const { container } = render(<Wrapper><GameYears activeYear={year} onYearChange={() => { }} /></Wrapper>);
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

        const { container } = render(<Wrapper><GameYears activeYear={year} onYearChange={() => { }} /></Wrapper>);
        await waitFor(() => {
            expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
            expect(screen.getByText(errorText)).toBeInTheDocument();
        });
    });

    it('renders with data', async () => {
        (useSWR as jest.Mock).mockReturnValue({
            data: [2001, 2002, 2003],
            error: undefined,
            isLoading: false,
        });
        const onYearChange = jest.fn();

        const { container } = render(<Wrapper><GameYears activeYear={year} onYearChange={onYearChange} /></Wrapper>);
        await waitFor(() => {
            expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
            expect(screen.getByText("2001")).toBeInTheDocument();
            expect(screen.getByText("2002")).toBeInTheDocument();
            expect(screen.getByText("2003")).toBeInTheDocument();
        });

        const yearButton = screen.getByText("2001");
        fireEvent.click(yearButton);

        expect(onYearChange).toHaveBeenCalledWith(2001);
    });
});
