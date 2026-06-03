'use client';

import { Text } from '@mantine/core';
import { range } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { format } from 'd3-format';
import type { ScaleBand, ScaleLinear } from 'd3-scale';
import { scaleBand, scaleLinear } from 'd3-scale';
import type { Selection } from 'd3-selection';
import { select } from 'd3-selection';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { formatDate, getShortMonthName } from '@/lib/dates';
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
     * - When `year === 0` a vertically scrollable stack of per-year panels is
     *   rendered, most recent year first, showing 3–4 panels by default.
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

// Pre-computed short month names in calendar order.
const MONTH_COLS = Array.from({ length: 12 }, (_, i) => getShortMonthName(2000, i + 1));

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
const M = { top: 4, right: 10, bottom: 24, left: 28 };
const YEAR_LABEL_HEIGHT = 22;
const PANEL_GAP = 16;
const VISIBLE_PANELS = 3.5;

interface TooltipContent {
    date: string;
    label: string;
    comment?: string | null;
}

type ShowTooltip = (event: globalThis.MouseEvent, content: TooltipContent) => void;

/**
 * Builds a scaleBand for the 12 month columns. The paddingInner is derived by
 * solving the D3 step formula so the inter-band gap equals GAP pixels at normal
 * widths. The result is clamped to [0, 0.5] for stability, so at very small
 * widths the gap is best-effort rather than exact.
 */
function makeXScale(iw: number): ScaleBand<string> {
    const n = MONTH_COLS.length;
    const paddingInner = (n * GAP) / (iw - (n - 1) * GAP);
    return scaleBand()
        .domain(MONTH_COLS)
        .range([0, iw])
        .paddingInner(Math.max(0, Math.min(paddingInner, 0.5)));
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

    // X axis — same scale instance drives both ticks and cell positions
    g.append('g')
        .attr('transform', `translate(0,${ih + 4})`)
        .call(axisBottom(xScale).tickSize(0))
        .call(ax => { ax.select('.domain').remove(); });

    // Y axis
    const yStep = Math.max(1, Math.ceil(maxRow / 10));
    const yTicks = range(1, maxRow + 1).filter(n => n === 1 || n % yStep === 0);
    const yScale: ScaleLinear<number, number> = scaleLinear()
        .domain([1, Math.max(maxRow, 2)])
        .range([cellSize / 2, ih - cellSize / 2]);
    g.append('g')
        .call(axisLeft(yScale).tickValues(yTicks).tickSize(0).tickFormat(format('d')))
        .call(ax => { ax.select('.domain').remove(); });

    // Cells
    g.selectAll<SVGRectElement, Cell>('rect.cell')
        .data(cells)
        .enter()
        .append('rect')
        .attr('class', 'cell')
        .attr('x', d => xScale(d.col) ?? 0)
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
 * The chart is responsive: it redraws whenever the wrapper is resized and
 * sets its own height based on the data. In the all-time view (`year === 0`)
 * the wrapper becomes vertically scrollable, capped to show ~3.5 year panels.
 *
 * @param props - See {@link Props}.
 */
export const PlayerHeatmap = ({ data, year }: Props) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (!svgRef.current || !wrapperRef.current || !tooltipRef.current) return;

        const showTooltip: ShowTooltip = (event, { date, label, comment }) => {
            const el = tooltipRef.current!;
            const wrapper = wrapperRef.current!;
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

            el.style.left = `${event.clientX - wrapperRect.left + wrapper.scrollLeft}px`;
            el.style.top = `${event.clientY - wrapperRect.top + wrapper.scrollTop + 16}px`;
            el.style.opacity = '1';
        };
        const hideTooltip = () => { tooltipRef.current!.style.opacity = '0'; };
        const onCellClick = (gameId: number) => router.push(`/footy/game/${gameId}`);

        const draw = (w: number) => {
            if (!svgRef.current || !wrapperRef.current) return;

            const svg = select(svgRef.current);
            svg.selectAll('*').remove();

            const iw = w - M.left - M.right;
            if (iw <= 0) return;
            const xScale = makeXScale(iw);
            const cellSize = xScale.bandwidth();

            if (year > 0) {
                const { cells, maxRow } = buildGrid(data);
                if (maxRow === 0) return;

                const ih = maxRow * cellSize + Math.max(0, maxRow - 1) * GAP;
                svg.attr('width', w).attr('height', ih + M.top + M.bottom);
                wrapperRef.current.style.maxHeight = '';

                const g = svg.append('g').attr('transform', `translate(${M.left},${M.top})`);
                drawPanel(g, cells, maxRow, xScale, showTooltip, hideTooltip, onCellClick);
            } else {
                const yearGroups = buildYearGroups(data);
                if (yearGroups.length === 0) return;

                const globalMaxRow = Math.max(...yearGroups.map(yg => yg.maxRow));
                const panelContentH = globalMaxRow * cellSize + Math.max(0, globalMaxRow - 1) * GAP;
                const panelH = YEAR_LABEL_HEIGHT + M.top + panelContentH + M.bottom;
                const totalH = yearGroups.length * panelH + Math.max(0, yearGroups.length - 1) * PANEL_GAP;

                svg.attr('width', w).attr('height', totalH);
                wrapperRef.current.style.maxHeight =
                    `${Math.min(totalH, Math.round(VISIBLE_PANELS * (panelH + PANEL_GAP)))}px`;

                yearGroups.forEach(({ year: yr, cells }, i) => {
                    const yOffset = i * (panelH + PANEL_GAP);
                    const panelG = svg.append('g').attr('transform', `translate(0,${yOffset})`);

                    panelG.append('text')
                        .attr('x', M.left)
                        .attr('y', YEAR_LABEL_HEIGHT - 4)
                        .style('font-size', '14px')
                        .style('font-weight', '600')
                        .style('fill', 'currentColor')
                        .text(yr);

                    const gridG = panelG.append('g')
                        .attr('transform', `translate(${M.left},${YEAR_LABEL_HEIGHT + M.top})`);
                    drawPanel(gridG, cells, globalMaxRow, xScale, showTooltip, hideTooltip, onCellClick);
                });
            }
        };

        const observer = new ResizeObserver(entries => {
            const { width } = entries[0].contentRect;
            draw(width);
        });
        observer.observe(wrapperRef.current);
        return () => observer.disconnect();
    }, [data, year, router]);

    if (data.length === 0) {
        return <Text c="dimmed" ta="center" py="xl">No game data available.</Text>;
    }

    return (
        <div ref={wrapperRef} className={styles.wrapper}>
            <svg ref={svgRef} />
            <div ref={tooltipRef} className={styles.tooltip} />
        </div>
    );
};
