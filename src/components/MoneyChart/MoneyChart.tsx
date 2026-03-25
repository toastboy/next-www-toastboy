'use client';

import * as d3 from 'd3';
import { useEffect, useRef } from 'react';

import { formatAmount, fromPounds } from '@/lib/money';
import { MoneyChartDatum } from '@/types/DebtType';

import styles from './MoneyChart.module.css';

export type { MoneyChartDatum };

export interface Props {
    data: MoneyChartDatum[];
}

const W = 520, H = 300;
const M = { top: 20, right: 20, bottom: 30, left: 55 };
const IW = W - M.left - M.right;
const IH = H - M.top - M.bottom;

type Datum = MoneyChartDatum & { balance: number };

function axes(
    g: d3.Selection<SVGGElement, unknown, null, undefined>,
    x: d3.ScaleBand<string>,
    y: d3.ScaleLinear<number, number>,
) {
    g.append('g')
        .attr('transform', `translate(0,${IH})`)
        .call(d3.axisBottom(x));
    g.append('g')
        .call(d3.axisLeft(y).tickFormat(v => `£${String(v)}`).ticks(6));
    g.append('line')
        .attr('x1', 0).attr('x2', IW)
        .attr('y1', y(0)).attr('y2', y(0))
        .attr('stroke', '#888').attr('stroke-dasharray', '4,2');
}

function balanceLine(
    g: d3.Selection<SVGGElement, unknown, null, undefined>,
    data: Datum[],
    x: d3.ScaleBand<string>,
    y: d3.ScaleLinear<number, number>,
) {
    const line = d3.line<Datum>()
        .x(d => (x(d.interval) ?? 0) + x.bandwidth() / 2)
        .y(d => y(d.balance));
    g.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#228be6')
        .attr('stroke-width', 2.5)
        .attr('d', line);
    g.selectAll('.dot')
        .data(data)
        .enter().append('circle')
        .attr('cx', d => (x(d.interval) ?? 0) + x.bandwidth() / 2)
        .attr('cy', d => y(d.balance))
        .attr('r', 4)
        .attr('fill', '#228be6');
}

function legend(
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    items: { label: string; color: string; dash?: boolean }[],
) {
    const lg = svg.append('g').attr('transform', `translate(${M.left + 4},${M.top + 4})`);
    items.forEach(({ label, color, dash }, i) => {
        const row = lg.append('g').attr('transform', `translate(0,${i * 18})`);
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

export const MoneyChart = ({ data: raw }: Props) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!svgRef.current || !tooltipRef.current) return;
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        let running = 0;
        const data: Datum[] = raw.map(d => {
            running += d.credits - d.debits;
            return { ...d, balance: running };
        });

        const tooltip = d3.select(tooltipRef.current);

        const showTooltip = (event: globalThis.MouseEvent, html: string) => {
            const svgRect = svgRef.current!.getBoundingClientRect();
            tooltip
                .style('opacity', '1')
                .style('left', `${event.clientX - svgRect.left + 12}px`)
                .style('top', `${event.clientY - svgRect.top - 28}px`)
                .html(html);
        };
        const hideTooltip = () => tooltip.style('opacity', '0');

        const x = d3.scaleBand()
            .domain(data.map(d => d.interval))
            .range([0, IW]).padding(0.3);

        const yMin = d3.min(data, d => d.balance - d.debits) ?? 0;
        const yMax = d3.max(data, d => d.balance + d.credits) ?? 0;
        const pad = (yMax - yMin) * 0.12;
        const y = d3.scaleLinear().domain([yMin - pad, yMax + pad]).range([IH, 0]);

        const g = svg.append('g').attr('transform', `translate(${M.left},${M.top})`);
        axes(g, x, y);

        // Debits: downward from balance
        g.selectAll('.db').data(data).enter().append('rect')
            .attr('x', d => x(d.interval) ?? 0)
            .attr('width', x.bandwidth())
            .attr('y', d => y(d.balance))
            .attr('height', d => y(d.balance - d.debits) - y(d.balance))
            .attr('fill', '#fa5252').attr('rx', 2)
            .style('cursor', 'pointer')
            .on('mousemove', (event: globalThis.MouseEvent, d) => showTooltip(event, `<b>${d.interval}</b><br/>Hall charges: <b>£${formatAmount(fromPounds(d.debits))}</b>`))
            .on('mouseleave', hideTooltip);

        // Credits: upward from balance
        g.selectAll('.cr').data(data).enter().append('rect')
            .attr('x', d => x(d.interval) ?? 0)
            .attr('width', x.bandwidth())
            .attr('y', d => y(d.balance + d.credits))
            .attr('height', d => y(d.balance) - y(d.balance + d.credits))
            .attr('fill', '#40c057').attr('rx', 2)
            .style('cursor', 'pointer')
            .on('mousemove', (event: globalThis.MouseEvent, d) => showTooltip(event, `<b>${d.interval}</b><br/>Player payments: <b>£${formatAmount(fromPounds(d.credits))}</b>`))
            .on('mouseleave', hideTooltip);

        balanceLine(g, data, x, y);

        // Larger invisible hit targets on balance dots
        g.selectAll('.dot-hit').data(data).enter().append('circle')
            .attr('cx', d => (x(d.interval) ?? 0) + x.bandwidth() / 2)
            .attr('cy', d => y(d.balance))
            .attr('r', 10)
            .attr('fill', 'transparent')
            .style('cursor', 'pointer')
            .on('mousemove', (event: globalThis.MouseEvent, d) => showTooltip(event, `<b>${d.interval}</b><br/>Balance: <b>£${formatAmount(fromPounds(d.balance))}</b>`))
            .on('mouseleave', hideTooltip);

        legend(svg, [
            { label: 'Player payments (credits)', color: '#40c057' },
            { label: 'Hall charges (debits)', color: '#fa5252' },
            { label: 'Running balance', color: '#228be6', dash: true },
        ]);
    }, [raw]);

    return (
        <div className={styles.wrapper}>
            <svg ref={svgRef} width={W} height={H} />
            <div ref={tooltipRef} className={styles.tooltip} />
        </div>
    );
};
