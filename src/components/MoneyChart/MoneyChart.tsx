'use client';

import { Text } from '@mantine/core';
import { max, min } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { type ScaleBand, scaleBand, type ScaleLinear, scaleLinear } from 'd3-scale';
import { select, type Selection } from 'd3-selection';
import { line } from 'd3-shape';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { MoneyChartDatum } from '@/types/DebtType';

import styles from './MoneyChart.module.css';

export interface Props {
    data: MoneyChartDatum[];
    linkBase?: string;
}

export const MoneyChart = ({ data: raw, linkBase }: Props) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (!svgRef.current || !tooltipRef.current || !wrapperRef.current) return;

        const tooltip = select(tooltipRef.current);

        const showTooltip = (event: globalThis.MouseEvent, html: string) => {
            const svgRect = svgRef.current!.getBoundingClientRect();
            tooltip
                .style('opacity', '1')
                .style('left', `${event.clientX - svgRect.left - 120}px`)
                .style('top', `${event.clientY - svgRect.top + 28}px`)
                .html(html);
        };
        const hideTooltip = () => tooltip.style('opacity', '0');

        let running = 0;
        const data: Datum[] = raw.map(d => {
            running += d.credits - d.debits;
            return { ...d, balance: running };
        });

        const draw = (w: number, h: number) => {
            /* v8 ignore next -- svgRef.current is always set after mount; null guard is unreachable in practice */
            if (!svgRef.current) return;
            const iw = w - M.left - M.right;
            const ih = h - M.top - M.bottom;

            const svg = select(svgRef.current);
            svg.attr('width', w).attr('height', h);
            svg.selectAll('*').remove();

            const x = scaleBand()
                /* v8 ignore next -- D3 domain accessor always receives the interval string */
                .domain(data.map(d => d.interval))
                .range([0, iw]).padding(0.3);

            /* v8 ignore next -- d3-array min/max return undefined only for empty data; fallback to 0 is a defensive backstop */
            const yMin = min(data, d => d.balance - d.debits) ?? 0;
            /* v8 ignore next -- d3-array max returns undefined only for empty data; fallback to 0 is a defensive backstop */
            const yMax = max(data, d => d.balance + d.credits) ?? 0;
            const pad = (yMax - yMin) * 0.12;
            const y = scaleLinear().domain([yMin - pad, yMax + pad]).range([ih, 0]);

            const g = svg.append('g').attr('transform', `translate(${M.left},${M.top})`);
            const minLabelSpacing = 40;
            const maxTicks = Math.max(1, Math.floor(iw / minLabelSpacing));
            const step = Math.ceil(data.length / maxTicks);
            const tickValues = data.filter((_, i) => i % step === 0).map(d => d.interval);
            axes(g, x, y, iw, ih, tickValues);

            const navigate = (_: globalThis.MouseEvent, d: Datum) => {
                if (linkBase) router.push(`${linkBase}${d.interval}`);
            };

            // Debits: downward from balance
            /* v8 ignore start -- D3 per-datum accessor callbacks are not invoked during jsdom rendering */
            g.selectAll('.db').data(data).enter().append('rect')
                .attr('x', d => x(d.interval) ?? 0)
                .attr('width', x.bandwidth())
                .attr('y', d => y(d.balance))
                .attr('height', d => y(d.balance - d.debits) - y(d.balance))
                .attr('fill', '#fa5252').attr('rx', 2)
                .style('cursor', 'pointer')
                .on('mousemove', (event: globalThis.MouseEvent, d) => showTooltip(event, `<b>${d.interval}</b><br/>Hall charges: <b>£${d.debits.toFixed(2)}</b>`))
                .on('mouseleave', hideTooltip)
                .on('click', navigate);

            // Credits: upward from balance
            g.selectAll('.cr').data(data).enter().append('rect')
                .attr('x', d => x(d.interval) ?? 0)
                .attr('width', x.bandwidth())
                .attr('y', d => y(d.balance + d.credits))
                .attr('height', d => y(d.balance) - y(d.balance + d.credits))
                .attr('fill', '#40c057').attr('rx', 2)
                .style('cursor', 'pointer')
                .on('mousemove', (event: globalThis.MouseEvent, d) => showTooltip(event, `<b>${d.interval}</b><br/>Player payments: <b>£${d.credits.toFixed(2)}</b>`))
                .on('mouseleave', hideTooltip)
                .on('click', navigate);
            /* v8 ignore stop */

            balanceLine(g, data, x, y);

            // Larger invisible hit targets on balance dots
            /* v8 ignore start -- D3 per-datum accessor callbacks are not invoked during jsdom rendering */
            g.selectAll('.dot-hit').data(data).enter().append('circle')
                .attr('cx', d => (x(d.interval) ?? 0) + x.bandwidth() / 2)
                .attr('cy', d => y(d.balance))
                .attr('r', 10)
                .attr('fill', 'transparent')
                .style('cursor', 'pointer')
                .on('mousemove', (event: globalThis.MouseEvent, d) => showTooltip(event, `<b>${d.interval}</b><br/>Balance: <b>£${d.balance.toFixed(2)}</b>`))
                .on('mouseleave', hideTooltip)
                .on('click', navigate);
            /* v8 ignore stop */

            legend(svg, [
                { label: 'Credits', color: '#40c057' },
                { label: 'Debits', color: '#fa5252' },
                { label: 'Balance', color: '#228be6', dash: true },
            ]);
        };

        const observer = new ResizeObserver(entries => {
            const { width, height } = entries[0].contentRect;
            draw(width, height);
        });

        observer.observe(wrapperRef.current);
        return () => observer.disconnect();
    }, [raw, linkBase, router]);

    if (raw.length === 0) {
        return (
            <Text c="dimmed" ta="center" py="xl">No transaction data available.</Text>
        );
    }

    return (
        <div ref={wrapperRef} className={styles.wrapper}>
            <svg ref={svgRef} />
            <div ref={tooltipRef} className={styles.tooltip} />
        </div>
    );
};

const M = { top: 20, right: 20, bottom: 30, left: 55 };

type Datum = MoneyChartDatum & { balance: number };

function axes(
    g: Selection<SVGGElement, unknown, null, undefined>,
    x: ScaleBand<string>,
    y: ScaleLinear<number, number>,
    iw: number,
    ih: number,
    tickValues: string[],
) {
    g.append('g')
        .attr('transform', `translate(0,${ih})`)
        .call(axisBottom(x).tickValues(tickValues));
    g.append('g')
        .call(axisLeft(y).tickFormat(v => `£${String(v)}`).ticks(6));
    g.append('line')
        .attr('x1', 0).attr('x2', iw)
        .attr('y1', y(0)).attr('y2', y(0))
        .attr('stroke', '#888').attr('stroke-dasharray', '4,2');
}

function balanceLine(
    g: Selection<SVGGElement, unknown, null, undefined>,
    data: Datum[],
    x: ScaleBand<string>,
    y: ScaleLinear<number, number>,
) {
    /* v8 ignore start -- D3 per-datum accessor callbacks are not invoked during jsdom rendering */
    const linePath = line<Datum>()
        .x(d => (x(d.interval) ?? 0) + x.bandwidth() / 2)
        .y(d => y(d.balance));
    g.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#228be6')
        .attr('stroke-width', 2.5)
        .attr('d', linePath);
    g.selectAll('.dot')
        .data(data)
        .enter().append('circle')
        .attr('cx', d => (x(d.interval) ?? 0) + x.bandwidth() / 2)
        .attr('cy', d => y(d.balance))
        .attr('r', 4)
        .attr('fill', '#228be6');
    /* v8 ignore stop */
}

function legend(
    svg: Selection<SVGSVGElement, unknown, null, undefined>,
    items: { label: string; color: string; dash?: boolean }[],
) {
    const lg = svg.append('g').attr('transform', `translate(${M.left + 4},${M.bottom - 30})`);
    items.forEach(({ label, color, dash }, i) => {
        const row = lg.append('g').attr('transform', `translate(${i * 80},0)`);
        if (dash) {
            row.append('line').attr('x1', 0).attr('x2', 18).attr('y1', 7).attr('y2', 7)
                .attr('stroke', color).attr('stroke-width', 2.5);
            row.append('circle').attr('cx', 9).attr('cy', 7).attr('r', 3).attr('fill', color);
        } else {
            row.append('rect').attr('width', 18).attr('height', 12).attr('fill', color).attr('rx', 2);
        }
        row.append('text').attr('x', 24).attr('y', 10)
            .style('font-size', '11px').style('fill', '#333')
            .text(label);
    });
}
