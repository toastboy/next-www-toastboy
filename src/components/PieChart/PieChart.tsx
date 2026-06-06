"use client";

import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { select } from 'd3-selection';
import { arc, pie, type PieArcDatum } from 'd3-shape';
import { useEffect, useRef } from 'react';

import styles from './PieChart.module.css';

export interface PieChartDatum {
    label: string;
    value: number;
}

export interface Props {
    data: PieChartDatum[];
}

export const PieChart = ({ data }: Props) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const draw = (w: number, h: number) => {
            // svgRef.current is non-null here: the callback guards both refs before calling draw.
            const svg = select(svgRef.current!);
            svg.selectAll('*').remove();

            const radius = Math.min(w, h) / 2;
            const color = scaleOrdinal(schemeCategory10);

            const pieLayout = pie<PieChartDatum>().value((d) => d.value);
            const arcPath = arc<PieArcDatum<PieChartDatum>>()
                .innerRadius(0)
                .outerRadius(radius);

            const g = svg.append('g')
                .attr('transform', `translate(${w / 2},${h / 2})`);

            g.selectAll('path')
                .data(pieLayout(data))
                .enter()
                .append('path')
                .attr('d', arcPath)
                .attr('fill', (_, i) => color(i.toString()))
                .attr('stroke', '#fff')
                .style('stroke-width', '2px');

            g.selectAll('text')
                .data(pieLayout(data))
                .enter()
                .append('text')
                .attr('transform', (d) => `translate(${arcPath.centroid(d).join(',')})`)
                .attr('text-anchor', 'middle')
                .attr('dy', '0.35em')
                .style('fill', 'white')
                .style('font-size', '12px')
                .text((d) => d.data.label);
        };

        // Guards both refs and the empty-entries case. Both refs are cleared on unmount,
        // so this also handles stale callbacks that fire after the component is removed.
        const observer = new ResizeObserver((entries) => {
            if (!svgRef.current || !wrapperRef.current || entries.length === 0) return;
            const { width, height } = entries[0].contentRect;
            draw(width, height);
        });

        // Both refs are non-null at effect time: the elements are unconditionally rendered.
        observer.observe(wrapperRef.current!);
        return () => observer.disconnect();
    }, [data]);

    return (
        <div ref={wrapperRef} className={styles.wrapper}>
            <svg ref={svgRef} className={styles.svg} />
        </div>
    );
};
