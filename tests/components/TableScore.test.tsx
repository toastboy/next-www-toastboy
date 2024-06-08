import { render, screen } from '@testing-library/react';
import TableScore from 'components/TableScore';
import { Wrapper, loaderClass } from "./lib/common";
import { FootyTable, FootyPlayerRecord } from 'lib/swr';

jest.mock('lib/swr');

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
    };

    it('renders correctly for points', () => {
        const { container } = render(<Wrapper><TableScore table={FootyTable.points} playerRecord={playerRecord} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText("10")).toBeInTheDocument();
    });

    it('renders correctly for averages', () => {
        const { container } = render(<Wrapper><TableScore table={FootyTable.averages} playerRecord={playerRecord} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText("1.000")).toBeInTheDocument();
    });

    it('renders correctly for speedy', () => {
        const { container } = render(<Wrapper><TableScore table={FootyTable.speedy} playerRecord={playerRecord} /></Wrapper>);
        expect(container.querySelector(loaderClass)).not.toBeInTheDocument();
        expect(screen.getByText("00:33:20")).toBeInTheDocument();
    });
});
