import { render, screen, waitFor } from '@testing-library/react';
import TableScore from 'components/TableScore';
import { FootyPlayerRecord, FootyTable } from 'lib/swr';
import { Wrapper, loaderClass } from "./lib/common";

describe('TableScore', () => {
    const playerRecord: FootyPlayerRecord = {
        year: 2001,
        playerId: 1,
        name: "Derek Turnipson",

        P: 10,
        W: 2,
        D: 4,
        L: 4,

        points: 10,
        averages: 1.0,
        stalwart: 100,
        pub: 0,
        speedy: 2000,

        rank_points: 4,
        rank_averages: 5,
        rank_stalwart: 1,
        rank_pub: 9,
        rank_speedy: 3,
    };

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('renders correctly for points', async () => {
        const { container } = render(<Wrapper><TableScore table={FootyTable.points} playerRecord={playerRecord} /></Wrapper>);
        await waitFor(() => {
            expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
            expect(screen.getByText("10")).toBeInTheDocument();
        });
    });

    it('renders correctly for averages', async () => {
        const { container } = render(<Wrapper><TableScore table={FootyTable.averages} playerRecord={playerRecord} /></Wrapper>);
        await waitFor(() => {
            expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
            expect(screen.getByText("1.000")).toBeInTheDocument();
        });
    });

    it('renders correctly for speedy', async () => {
        const { container } = render(<Wrapper><TableScore table={FootyTable.speedy} playerRecord={playerRecord} /></Wrapper>);
        await waitFor(() => {
            expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
            expect(screen.getByText("00:33:20")).toBeInTheDocument();
        });
    });
});
