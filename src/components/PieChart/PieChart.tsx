"use client";

import * as d3 from "d3";
import { useEffect, useRef } from "react";

interface PieChartProps {
    data: { label: string; value: number }[];
    width?: number;
    height?: number;
}

const PieChart = ({ data, width = 300, height = 300 }: PieChartProps) => {
    const chartRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!chartRef.current) return;

        // Clear previous SVG elements (important for rerenders)
        const svg = d3.select(chartRef.current);
        svg.selectAll("*").remove();

        const radius = Math.min(width, height) / 2;
        const color = d3.scaleOrdinal(d3.schemeCategory10);

        const pie = d3.pie<{ label: string; value: number }>().value((d) => d.value);
        const arc = d3.arc<d3.PieArcDatum<{ label: string; value: number }>>()
            .innerRadius(0)
            .outerRadius(radius);

        const g = svg.append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`);

        g.selectAll("path")
            .data(pie(data))
            .enter()
            .append("path")
            .attr("d", arc)
            .attr("fill", (_, i) => color(i.toString()))
            .attr("stroke", "#fff")
            .style("stroke-width", "2px");

        g.selectAll("text")
            .data(pie(data))
            .enter()
            .append("text")
            .attr("transform", (d) => `translate(${arc.centroid(d)})`)
            .attr("text-anchor", "middle")
            .attr("dy", "0.35em")
            .style("fill", "white")
            .style("font-size", "12px")
            .text((d) => d.data.label);
    }, [data, width, height]);

    return (
        <svg ref={chartRef} width={width} height={height} />
    );
};

export default PieChart;