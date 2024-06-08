import { render, screen } from '@testing-library/react';
import PlayerArse from 'components/PlayerArse';
import { Wrapper, errorText, loaderClass } from "./lib/common";
import { usePlayerArse } from 'lib/swr';

jest.mock('lib/swr');

describe('PlayerArse', () => {
    const idOrLogin = 'derekt';

    it('renders loading state', () => {
        (usePlayerArse as jest.Mock).mockReturnValue({
            data: undefined,
            error: undefined,
            isLoading: true,
        });

        const { container } = render(<Wrapper><PlayerArse idOrLogin={idOrLogin} /></Wrapper>);
        expect(container.querySelector(loaderClass)).toBeInTheDocument();
    });

    it('renders error state', () => {
        (usePlayerArse as jest.Mock).mockReturnValue({
            data: undefined,
            error: new Error(errorText),
            isLoading: false,
        });

        const { container } = render(<Wrapper><PlayerArse idOrLogin={idOrLogin} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText(errorText)).toBeInTheDocument();
    });

    it('renders error state when data is null', () => {
        (usePlayerArse as jest.Mock).mockReturnValue({
            data: null,
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><PlayerArse idOrLogin={idOrLogin} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText(errorText)).toBeInTheDocument();
    });

    it('renders with data', () => {
        (usePlayerArse as jest.Mock).mockReturnValue({
            data: {
                in_goal: 1,
                running: 2,
                shooting: 3,
                passing: 4,
                ball_skill: 5,
                attacking: 6,
                defending: 7,
            },
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><PlayerArse idOrLogin={idOrLogin} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText("In Goal: 1")).toBeInTheDocument();
        expect(screen.getByText("Defending: 7")).toBeInTheDocument();
    });
});
