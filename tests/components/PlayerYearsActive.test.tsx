import { fireEvent, render, screen } from '@testing-library/react';
import PlayerYearsActive from 'components/PlayerYearsActive';
import { Wrapper, errorText, loaderClass } from "./lib/common";
import { usePlayerYearsActive } from 'lib/swr';

const idOrLogin = "1";
const year = 2001;

jest.mock('lib/swr');
jest.mock('@mantine/core', () => {
    return {
        ...jest.requireActual('@mantine/core'),
        FloatingIndicator: ({ children }: { children: React.ReactNode }) => (
            <div data-testid="mock-floating-indicator">{children}</div>
        ),
    };
});

describe('PlayerYearsActive', () => {
    it('renders loading state', () => {
        (usePlayerYearsActive as jest.Mock).mockReturnValue({
            data: undefined,
            error: undefined,
            isLoading: true,
        });

        const { container } = render(<Wrapper><PlayerYearsActive idOrLogin={idOrLogin} activeYear={year} onYearChange={() => { }} /></Wrapper>);
        expect(container.querySelector(loaderClass)).toBeInTheDocument();
    });

    it('renders error state', () => {
        (usePlayerYearsActive as jest.Mock).mockReturnValue({
            data: undefined,
            error: new Error(errorText),
            isLoading: false,
        });

        const { container } = render(<Wrapper><PlayerYearsActive idOrLogin={idOrLogin} activeYear={year} onYearChange={() => { }} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText(errorText)).toBeInTheDocument();
    });

    it('renders error state when data is null', () => {
        (usePlayerYearsActive as jest.Mock).mockReturnValue({
            data: null,
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><PlayerYearsActive idOrLogin={idOrLogin} activeYear={year} onYearChange={() => { }} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText(errorText)).toBeInTheDocument();
    });

    it('renders with data', () => {
        (usePlayerYearsActive as jest.Mock).mockReturnValue({
            data: [2001, 2002, 2003, 0],
            error: undefined,
            isLoading: false,
        });
        const onYearChange = jest.fn();

        const { container } = render(<Wrapper><PlayerYearsActive idOrLogin={idOrLogin} activeYear={year} onYearChange={onYearChange} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText("2001")).toBeInTheDocument();
        expect(screen.getByText("2002")).toBeInTheDocument();
        expect(screen.getByText("2003")).toBeInTheDocument();
        expect(screen.getByText("All-time")).toBeInTheDocument();

        const yearButton = screen.getByText("2001");
        fireEvent.click(yearButton);

        expect(onYearChange).toHaveBeenCalledWith(2001);
    });
});
