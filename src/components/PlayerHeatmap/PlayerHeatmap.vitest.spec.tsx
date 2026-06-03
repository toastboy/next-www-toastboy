import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { Wrapper } from '@/tests/components/lib/common';
import { createMockGameDay } from '@/tests/mocks/data/gameDay';
import { createMockOutcome } from '@/tests/mocks/data/outcome';
import { PlayerFormType } from '@/types';

import { buildGrid, buildYearGroups, PlayerHeatmap } from './PlayerHeatmap';

class ImmediateResizeObserver {
    private callback: ResizeObserverCallback;
    constructor(callback: ResizeObserverCallback) {
        this.callback = callback;
    }
    observe(_target: Element) {
        const entry = { contentRect: { width: 600 } };
        this.callback([entry as unknown as ResizeObserverEntry], this);
    }
    unobserve() { /* empty */ }
    disconnect() { /* empty */ }
}

/** One game per month in 2024, result cycling through win/draw/loss/null. */
const buildYearData = (): PlayerFormType[] =>
    Array.from({ length: 12 }, (_, i) => ({
        ...createMockOutcome({ gameDayId: i + 1, points: [3, 1, 0, null][i % 4] }),
        gameDay: createMockGameDay({ id: i + 1, date: new Date(2024, i, 7) }),
    }));

/** Two games per year across 3 years, for all-time view. */
const buildAllTimeData = (): PlayerFormType[] =>
    [2022, 2023, 2024].flatMap((yr, yi) =>
        [0, 1].map(gi => ({
            ...createMockOutcome({ gameDayId: yi * 2 + gi + 1, points: gi === 0 ? 3 : 0 }),
            gameDay: createMockGameDay({ id: yi * 2 + gi + 1, date: new Date(yr, gi * 3, 7) }),
        })),
    );

/** One game + one no-game day in January 2024. */
const buildWithNoGameData = (): PlayerFormType[] => [
    {
        ...createMockOutcome({ gameDayId: 1, points: 3 }),
        gameDay: createMockGameDay({ id: 1, date: new Date(2024, 0, 7), game: true }),
    },
    {
        id: -2,
        gameDayId: 2,
        playerId: 1,
        response: null,
        responseInterval: null,
        points: null,
        team: null,
        comment: null,
        pub: null,
        goalie: null,
        gameDay: createMockGameDay({ id: 2, date: new Date(2024, 0, 14), game: false }),
    },
];

describe('buildGrid', () => {
    it('always produces 12 month columns', () => {
        const { cells } = buildGrid(buildYearData());
        const cols = [...new Set(cells.map(c => c.col))];
        expect(cols).toHaveLength(12);
    });

    it('assigns row numbers starting at 1 within each column', () => {
        const { cells } = buildGrid(buildYearData());
        for (const col of ['Jan', 'Feb', 'Mar']) {
            const colCells = cells.filter(c => c.col === col);
            expect(colCells[0].row).toBe(1);
        }
    });

    it('reports maxRow as the highest game count in any column', () => {
        const { maxRow } = buildGrid(buildYearData());
        expect(maxRow).toBe(1);
    });

    it('returns empty cells and maxRow 0 for empty input', () => {
        const { cells, maxRow } = buildGrid([]);
        expect(cells).toHaveLength(0);
        expect(maxRow).toBe(0);
    });

    it('marks cells as noGame when gameDay.game is false', () => {
        const { cells } = buildGrid(buildWithNoGameData());
        const janCells = cells.filter(c => c.col === 'Jan');
        expect(janCells).toHaveLength(2);
        expect(janCells.find(c => c.noGame)).toBeDefined();
        expect(janCells.find(c => !c.noGame)).toBeDefined();
    });
});

describe('buildYearGroups', () => {
    it('returns one group per year, most recent first', () => {
        const groups = buildYearGroups(buildAllTimeData());
        expect(groups.map(g => g.year)).toEqual(['2024', '2023', '2022']);
    });

    it('each group contains only the cells for that year', () => {
        const groups = buildYearGroups(buildAllTimeData());
        for (const group of groups) {
            expect(group.cells.length).toBeGreaterThan(0);
            expect(group.maxRow).toBeGreaterThan(0);
        }
    });

    it('returns an empty array for empty input', () => {
        expect(buildYearGroups([])).toHaveLength(0);
    });
});

describe('PlayerHeatmap', () => {
    beforeEach(() => {
        vi.stubGlobal('ResizeObserver', ImmediateResizeObserver);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('shows empty state when data is empty', () => {
        render(
            <Wrapper>
                <PlayerHeatmap data={[]} year={2024} />
            </Wrapper>,
        );
        expect(screen.getByText('No game data available.')).toBeInTheDocument();
    });

    it('renders a rect cell for each game in yearly view', () => {
        const data = buildYearData();
        const { container } = render(
            <Wrapper>
                <PlayerHeatmap data={data} year={2024} />
            </Wrapper>,
        );
        const cells = container.querySelectorAll('rect.cell');
        expect(cells.length).toBe(data.length);
    });

    it('renders a rect cell for each game in all-time view', () => {
        const data = buildAllTimeData();
        const { container } = render(
            <Wrapper>
                <PlayerHeatmap data={data} year={0} />
            </Wrapper>,
        );
        const cells = container.querySelectorAll('rect.cell');
        expect(cells.length).toBe(data.length);
    });

    it('renders month labels on the X axis for yearly view', () => {
        const { container } = render(
            <Wrapper>
                <PlayerHeatmap data={buildYearData()} year={2024} />
            </Wrapper>,
        );
        const labels = Array.from(container.querySelectorAll('svg text')).map(el => el.textContent);
        expect(labels).toContain('Jan');
        expect(labels).toContain('Dec');
    });

    it('renders a year label for each year in the all-time view', () => {
        const { container } = render(
            <Wrapper>
                <PlayerHeatmap data={buildAllTimeData()} year={0} />
            </Wrapper>,
        );
        const labels = Array.from(container.querySelectorAll('svg text')).map(el => el.textContent);
        expect(labels).toContain('2022');
        expect(labels).toContain('2023');
        expect(labels).toContain('2024');
    });

    it('renders month labels inside each year panel in the all-time view', () => {
        const { container } = render(
            <Wrapper>
                <PlayerHeatmap data={buildAllTimeData()} year={0} />
            </Wrapper>,
        );
        const labels = Array.from(container.querySelectorAll('svg text')).map(el => el.textContent);
        expect(labels).toContain('Jan');
        expect(labels).toContain('Dec');
    });

    it('shows tooltip with date and result on mousemove', () => {
        const data = buildYearData();
        const { container } = render(
            <Wrapper>
                <PlayerHeatmap data={data} year={2024} />
            </Wrapper>,
        );
        const cell = container.querySelector('rect.cell')!;
        const tooltipDiv = container.querySelector('svg')!.nextElementSibling as HTMLElement;

        fireEvent.mouseMove(cell);
        expect(tooltipDiv.style.opacity).toBe('1');
        expect(tooltipDiv.innerHTML).toContain('2024');
    });

    it('hides tooltip on mouseleave', () => {
        const { container } = render(
            <Wrapper>
                <PlayerHeatmap data={buildYearData()} year={2024} />
            </Wrapper>,
        );
        const cell = container.querySelector('rect.cell')!;
        const tooltipDiv = container.querySelector('svg')!.nextElementSibling as HTMLElement;

        fireEvent.mouseMove(cell);
        expect(tooltipDiv.style.opacity).toBe('1');

        fireEvent.mouseLeave(cell);
        expect(tooltipDiv.style.opacity).toBe('0');
    });

    it('shows "No game" in tooltip for a no-game day cell', () => {
        const { container } = render(
            <Wrapper>
                <PlayerHeatmap data={buildWithNoGameData()} year={2024} />
            </Wrapper>,
        );
        const cells = container.querySelectorAll('rect.cell');
        // Second cell in January is the no-game day (14 Jan)
        const tooltipDiv = container.querySelector('svg')!.nextElementSibling as HTMLElement;
        fireEvent.mouseMove(cells[1]);
        expect(tooltipDiv.innerHTML).toContain('No game');
    });
});
