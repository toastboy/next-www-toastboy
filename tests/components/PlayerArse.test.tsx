jest.mock('swr');

import { render, screen, waitFor } from '@testing-library/react';
import PlayerArse from 'components/PlayerArse/PlayerArse';
import useSWR from 'swr';
import { Wrapper, errorText, loaderClass } from "./lib/common";

describe('PlayerArse', () => {
    const idOrLogin = 'derekt';

    beforeAll(() => {
        jest.resetAllMocks();
    });

    it('renders loading state', async () => {
        (useSWR as jest.Mock).mockReturnValue({
            data: undefined,
            error: undefined,
            isLoading: true,
        });

        const { container } = render(<Wrapper><PlayerArse idOrLogin={idOrLogin} /></Wrapper>);
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

        const { container } = render(<Wrapper><PlayerArse idOrLogin={idOrLogin} /></Wrapper>);
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

        const { container } = render(<Wrapper><PlayerArse idOrLogin={idOrLogin} /></Wrapper>);
        await waitFor(() => {
            expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
            expect(screen.getByText(errorText)).toBeInTheDocument();
        });
    });

    it('renders with data', async () => {
        (useSWR as jest.Mock).mockReturnValue({
            data: {
                inGoal: 1,
                running: 2,
                shooting: 3,
                passing: 4,
                ballSkill: 5,
                attacking: 6,
                defending: 7,
            },
            error: undefined,
            isLoading: false,
        });

        const { container } = render(<Wrapper><PlayerArse idOrLogin={idOrLogin} /></Wrapper>);
        await waitFor(() => {
            expect(screen.queryByTestId(loaderClass)).not.toBeInTheDocument();
            expect(screen.getByText("In Goal: 1")).toBeInTheDocument();
            expect(screen.getByText("Running: 2")).toBeInTheDocument();
            expect(screen.getByText("Shooting: 3")).toBeInTheDocument();
            expect(screen.getByText("Passing: 4")).toBeInTheDocument();
            expect(screen.getByText("Ball Skill: 5")).toBeInTheDocument();
            expect(screen.getByText("Attacking: 6")).toBeInTheDocument();
            expect(screen.getByText("Defending: 7")).toBeInTheDocument();
        });
    });
});
