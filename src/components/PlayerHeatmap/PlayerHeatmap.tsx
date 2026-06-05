'use client';

import { Text } from '@mantine/core';
import { axisBottom } from 'd3-axis';
import type { ScaleBand } from 'd3-scale';
import { scaleBand } from 'd3-scale';
import type { Selection } from 'd3-selection';
import { select } from 'd3-selection';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import { formatDate, getNarrowMonthName, getShortMonthName } from '@/lib/dates';
import { type PlayerFormType } from '@/types';

import styles from './PlayerHeatmap.module.css';

export interface Props {
    /**
     * Outcomes to visualise. Every entry must have a populated `gameDay`
     * (including a native `Date` object for `gameDay.date` — Prisma returns
     * `Date`, but JSON-serialised props will have a string and will not render
     * correctly). Entries whose `gameDay.game` is `false` represent scheduled
     * days on which no game took place; they are shown in light grey and
     * navigate to the game day details page on click. Entries with
     * `points === null` and `game === true` represent days the player was
     * invited but did not play.
     */
    data: PlayerFormType[];
    /**
     * The calendar year being displayed, or `0` for the all-time view.
     *
     * - When `year > 0` the chart renders a single panel with months (Jan–Dec)
     *   on the X axis and game-number-within-month on the Y axis.
     * - When `year === 0` year panels are laid out side by side, wrapping to
     *   the next row when the viewport width is exhausted, most recent year first.
     */
    year: number;
}

interface Cell {
    col: string;
    row: number;
    points: number | null | undefined;
    noGame: boolean;
    date: Date;
    gameId: number;
    comment: string | null | undefined;
}

const colorMap = new Map<number | null | undefined, string>([
    [null, 'var(--mantine-color-gray-5)'],
    [undefined, 'var(--mantine-color-gray-5)'],
    [0, 'var(--mantine-color-red-6)'],
    [1, 'var(--mantine-color-yellow-5)'],
    [3, 'var(--mantine-color-green-6)'],
]);

const NO_GAME_COLOR = 'var(--mantine-color-gray-3)';

const resultLabel = new Map<number | null | undefined, string>([
    [null, 'Did not play'],
    [undefined, 'Did not play'],
    [0, 'Lost'],
    [1, 'Draw'],
    [3, 'Won'],
]);

// Short names are the unique domain keys; narrow names are used for axis display.
const MONTH_COLS = Array.from({ length: 12 }, (_, i) => getShortMonthName(2000, i + 1));
const SHORT_TO_NARROW = new Map(
    MONTH_COLS.map((short, i) => [short, getNarrowMonthName(2000, i + 1)]),
);

/** Builds the flat cell list for a single year's data (always month columns). */
export function buildGrid(data: PlayerFormType[]): { cells: Cell[]; maxRow: number } {
    const grouped = new Map<string, PlayerFormType[]>();

    for (const entry of data) {
        if (!entry.gameDay) continue;
        const date = new Date(entry.gameDay.date);
        const col = getShortMonthName(date.getFullYear(), date.getMonth() + 1);
        const list = grouped.get(col) ?? [];
        list.push(entry);
        grouped.set(col, list);
    }

    const cells: Cell[] = [];
    let maxRow = 0;

    for (const col of MONTH_COLS) {
        const entries = (grouped.get(col) ?? []).sort(
            (a, b) => new Date(a.gameDay!.date).getTime() - new Date(b.gameDay!.date).getTime(),
        );
        entries.forEach((entry, i) => {
            cells.push({
                col,
                row: i + 1,
                points: entry.points ?? null,
                noGame: entry.gameDay!.game === false,
                date: new Date(entry.gameDay!.date),
                gameId: entry.gameDay!.id,
                comment: entry.gameDay?.comment,
            });
        });
        maxRow = Math.max(maxRow, entries.length);
    }

    return { cells, maxRow };
}

/**
 * Groups data by year, builds a cell list for each year, and returns an array of year groups
 * sorted in reverse chronological order.
 */
export function buildYearGroups(data: PlayerFormType[]): { year: string; cells: Cell[]; maxRow: number }[] {
    const byYear = new Map<string, PlayerFormType[]>();
    for (const entry of data) {
        if (!entry.gameDay) continue;
        const yr = String(new Date(entry.gameDay.date).getFullYear());
        const list = byYear.get(yr) ?? [];
        list.push(entry);
        byYear.set(yr, list);
    }
    return Array.from(byYear.keys())
        .sort((a, b) => Number(b) - Number(a))
        .map(yr => ({ year: yr, ...buildGrid(byYear.get(yr)!) }));
}

const GAP = 2;
const CELL_SIZE = 10;
const M = { top: 4, right: 10, bottom: 24, left: 4 };
const YEAR_LABEL_HEIGHT = 22;

interface TooltipContent {
    date: string;
    label: string;
    comment?: string | null;
}

type ShowTooltip = (event: globalThis.MouseEvent, content: TooltipContent) => void;

/**
 * Returns an X scale for the month columns, along with the calculated inner
 * width (excluding margins) needed to fit the columns at the specified cell
 * size and gap. The scale's domain is the short month names (e.g., "Jan",
 * "Feb") and its range is [0, innerWidth]. The scale's bandwidth is the cell
 * size, and its paddingInner is set to create the specified gap between cells.
 * The caller can use the returned inner width to set the SVG width and the
 * scale to position cells and axis ticks.
 *
 * @returns An object containing the configured X scale and the calculated inner
 * width.
 */
function makeXScale(): { scale: ScaleBand<string>; iw: number } {
    const n = MONTH_COLS.length;
    const iw = n * CELL_SIZE + (n - 1) * GAP;
    const paddingInner = GAP / (CELL_SIZE + GAP);
    const scale = scaleBand()
        .domain(MONTH_COLS)
        .range([0, iw])
        .paddingInner(paddingInner);
    return { scale, iw };
}

function drawPanel(
    g: Selection<SVGGElement, unknown, null, undefined>,
    cells: Cell[],
    maxRow: number,
    xScale: ScaleBand<string>,
    showTooltip: ShowTooltip,
    hideTooltip: () => void,
    onCellClick: (gameId: number) => void,
) {
    const cellSize = xScale.bandwidth();
    const ih = maxRow * cellSize + Math.max(0, maxRow - 1) * GAP;

    // X axis — domain keys are short names; labels are rendered as narrow single letters
    g.append('g')
        .attr('transform', `translate(0,${ih + 4})`)
        .call(axisBottom(xScale).tickSize(0).tickFormat(d => SHORT_TO_NARROW.get(d)!))
        .call(ax => { ax.select('.domain').remove(); });

    // Cells
    g.selectAll<SVGRectElement, Cell>('rect.cell')
        .data(cells)
        .enter()
        .append('rect')
        .attr('class', 'cell')
        .attr('x', d => xScale(d.col)!)
        .attr('y', d => (d.row - 1) * (cellSize + GAP))
        .attr('width', xScale.bandwidth())
        .attr('height', cellSize)
        .attr('rx', 2)
        .attr('role', 'button')
        .attr('tabindex', '0')
        .attr('aria-label', d => {
            if (d.noGame) {
                const status = d.comment ? `No game — ${d.comment}` : 'No game';
                return `${formatDate(d.date)} – ${status}`;
            }
            return `${formatDate(d.date)} – ${resultLabel.get(d.points) ?? ''}`;
        })
        .style('fill', d => d.noGame ? NO_GAME_COLOR : (colorMap.get(d.points) ?? 'var(--mantine-color-gray-5)'))
        .style('cursor', 'pointer')
        .on('mousemove', (event: globalThis.MouseEvent, d) => {
            showTooltip(event, {
                date: formatDate(d.date),
                label: d.noGame ? 'No game' : (resultLabel.get(d.points) ?? ''),
                comment: d.noGame ? d.comment : undefined,
            });
        })
        .on('mouseleave', hideTooltip)
        .on('click', (_, d) => { onCellClick(d.gameId); })
        .on('keydown', (event: globalThis.KeyboardEvent, d) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onCellClick(d.gameId);
            }
        });
}

interface YearPanelProps {
    label: string;
    cells: Cell[];
    globalMaxRow: number;
    showTooltip: ShowTooltip;
    hideTooltip: () => void;
}

/**
 * Renders a panel for a single year in the player's heatmap.
 *
 * @param props - See {@link YearPanelProps}.
 */
const YearPanel = ({ label, cells, globalMaxRow, showTooltip, hideTooltip }: YearPanelProps) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const router = useRouter();

    useEffect(() => {
        /* c8 ignore next */
        if (!svgRef.current) return;
        const onCellClick = (gameId: number) => router.push(`/footy/game/${gameId}`);
        const { scale: xScale, iw } = makeXScale();
        const cellSize = xScale.bandwidth();
        const ih = globalMaxRow * cellSize + Math.max(0, globalMaxRow - 1) * GAP;
        const w = iw + M.left + M.right;
        const h = YEAR_LABEL_HEIGHT + M.top + ih + M.bottom;

        const svg = select(svgRef.current);
        svg.selectAll('*').remove();
        svg.attr('width', w).attr('height', h);

        svg.append('text')
            .attr('x', M.left)
            .attr('y', YEAR_LABEL_HEIGHT - 4)
            .style('font-size', '14px')
            .style('font-weight', '600')
            .style('fill', 'currentColor')
            .text(label);

        const g = svg.append('g').attr('transform', `translate(${M.left},${YEAR_LABEL_HEIGHT + M.top})`);
        drawPanel(g, cells, globalMaxRow, xScale, showTooltip, hideTooltip, onCellClick);
    }, [cells, globalMaxRow, hideTooltip, label, router, showTooltip]);

    return <svg ref={svgRef} />;
};

/**
 * Renders a D3 heatmap of a player's game history.
 *
 * Each cell represents one game day, coloured by result:
 * - Green  — won (points = 3)
 * - Yellow — draw (points = 1)
 * - Grey   — invited but did not play (points = null, game = true)
 * - Red    — lost (points = 0)
 * - Light grey — no game took place (gameDay.game = false)
 *
 * Clicking or pressing Enter/Space on any cell navigates to the corresponding
 * game page (`/footy/game/[id]`). No-game cells show the game day comment in
 * the tooltip when one is available.
 *
 * In the all-time view (`year === 0`) year panels are arranged side by side,
 * wrapping to the next row when the available width is exhausted. In a
 * single-year view (`year > 0`) one panel is rendered inline.
 *
 * @param props - See {@link Props}.
 */
export const PlayerHeatmap = ({ data, year }: Props) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const router = useRouter();

    const showTooltip = useCallback(
        (event: globalThis.MouseEvent, { date, label, comment }: TooltipContent) => {
            const el = tooltipRef.current;
            const wrapper = wrapperRef.current;
            /* c8 ignore next */
            if (!el || !wrapper) return;
            const wrapperRect = wrapper.getBoundingClientRect();

            // Build content with text nodes — avoids innerHTML / XSS risk.
            el.textContent = '';
            const b = document.createElement('b');
            b.textContent = date;
            el.appendChild(b);
            el.appendChild(document.createElement('br'));
            el.appendChild(document.createTextNode(label));
            if (comment) {
                el.appendChild(document.createElement('br'));
                el.appendChild(document.createTextNode(comment));
            }

            el.style.left = `${event.clientX - wrapperRect.left}px`;
            el.style.top = `${event.clientY - wrapperRect.top + 16}px`;
            el.style.opacity = '1';
        },
        [],
    );

    const hideTooltip = useCallback(() => {
        /* c8 ignore next */
        if (tooltipRef.current) tooltipRef.current.style.opacity = '0';
    }, []);

    // Single-year drawing
    useEffect(() => {
        if (year === 0 || !svgRef.current) return;
        const onCellClick = (gameId: number) => router.push(`/footy/game/${gameId}`);
        const { cells, maxRow } = buildGrid(data);
        if (maxRow === 0) return;
        const { scale: xScale, iw } = makeXScale();
        const cellSize = xScale.bandwidth();
        const ih = maxRow * cellSize + Math.max(0, maxRow - 1) * GAP;
        const w = iw + M.left + M.right;
        const svg = select(svgRef.current);
        svg.selectAll('*').remove();
        svg.attr('width', w).attr('height', ih + M.top + M.bottom);
        const g = svg.append('g').attr('transform', `translate(${M.left},${M.top})`);
        drawPanel(g, cells, maxRow, xScale, showTooltip, hideTooltip, onCellClick);
    }, [data, hideTooltip, router, showTooltip, year]);

    const yearGroups = useMemo(
        () => year === 0 ? buildYearGroups(data) : null,
        [data, year],
    );
    const globalMaxRow = useMemo(
        () => yearGroups ? Math.max(0, ...yearGroups.map(yg => yg.maxRow)) : 0,
        [yearGroups],
    );

    if (data.length === 0) {
        return <Text c="dimmed" ta="center" py="xl">No game data available.</Text>;
    }

    if (year === 0) {
        return (
            <div ref={wrapperRef} className={styles.allTimeWrapper}>
                {yearGroups!.map(({ year: yr, cells }) => (
                    <YearPanel
                        key={yr}
                        label={yr}
                        cells={cells}
                        globalMaxRow={globalMaxRow}
                        showTooltip={showTooltip}
                        hideTooltip={hideTooltip}
                    />
                ))}
                <div ref={tooltipRef} className={styles.tooltip} />
            </div>
        );
    }

    return (
        <div ref={wrapperRef} className={styles.wrapper}>
            <svg ref={svgRef} />
            <div ref={tooltipRef} className={styles.tooltip} />
        </div>
    );
};
