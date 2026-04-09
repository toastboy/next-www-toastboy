'use client';

import { Box, Tooltip } from '@mantine/core';
import * as d3 from 'd3';
import { useCallback, useEffect, useRef, useState } from 'react';

import { FamilyTreeNodeType } from '@/types';

/**
 * Properties for the {@link FamilyTree} component.
 */
export interface Props {
    /** Hierarchical tree data rooted at the founding player. */
    data: FamilyTreeNodeType;
}

/** Stroke colour for the links between nodes. */
const LINK_STROKE = '#555';
/** Stroke opacity for the links. */
const LINK_STROKE_OPACITY = 0.4;
/** Stroke width for the links. */
const LINK_STROKE_WIDTH = 1.5;
/** Diameter of mugshot images in pixels. */
const MUGSHOT_SIZE = 20;

/**
 * A D3-powered radial tree layout visualising how players were introduced to
 * the club. Based on the Observable "Radial Tidy Tree" example.
 *
 * The founding player sits at the centre, and each subsequent generation of
 * introductions fans out from there.
 *
 * Player nodes display small circular mugshots; hovering shows the player's
 * name in a tooltip. The chart fills all available horizontal space.
 *
 * @see https://observablehq.com/@d3/radial-tree/2
 */
export const FamilyTree = ({ data }: Props) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    /** Currently hovered node position + name for the Mantine Tooltip. */
    const [tooltip, setTooltip] = useState<{
        x: number;
        y: number;
        name: string;
    } | null>(null);
    /** Measured container width; drives SVG sizing. */
    const [width, setWidth] = useState(928);

    /** Update the measured width whenever the container resizes. */
    const updateWidth = useCallback(() => {
        if (containerRef.current) {
            setWidth(containerRef.current.clientWidth);
        }
    }, []);

    useEffect(() => {
        updateWidth();
        const ro = new ResizeObserver(updateWidth);
        if (containerRef.current) ro.observe(containerRef.current);
        return () => ro.disconnect();
    }, [updateWidth]);

    useEffect(() => {
        if (!svgRef.current) return;

        const height = width;
        const cx = width * 0.5;
        const cy = height * 0.5;
        const radius = Math.min(width, height) / 2 - MUGSHOT_SIZE - 10;

        const tree = d3
            .tree<FamilyTreeNodeType>()
            .size([2 * Math.PI, radius])
            .separation((a, b) => (a.parent === b.parent ? 1 : 2) / a.depth);

        const root = tree(
            d3
                .hierarchy(data)
                .sort((a, b) => d3.ascending(a.data.name, b.data.name)),
        );

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        svg
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', [-cx, -cy, width, height].join(' '))
            .style('user-select', 'none');

        /* Defs: circular clip path for mugshots */
        const defs = svg.append('defs');
        defs
            .append('clipPath')
            .attr('id', 'mugshot-clip')
            .append('circle')
            .attr('r', MUGSHOT_SIZE / 2)
            .attr('cx', 0)
            .attr('cy', 0);

        /* Links */
        svg
            .append('g')
            .attr('fill', 'none')
            .attr('stroke', LINK_STROKE)
            .attr('stroke-opacity', LINK_STROKE_OPACITY)
            .attr('stroke-width', LINK_STROKE_WIDTH)
            .selectAll('path')
            .data(root.links())
            .join('path')
            .attr(
                'd',
                d3
                    .linkRadial<
                        d3.HierarchyPointLink<FamilyTreeNodeType>,
                        d3.HierarchyPointNode<FamilyTreeNodeType>
                    >()
                    .angle((d) => d.x)
                    .radius((d) => d.y),
            );

        /* Nodes */
        const node = svg
            .append('g')
            .selectAll('g')
            .data(root.descendants())
            .join('g')
            .attr(
                'transform',
                (d) => `rotate(${(d.x * 180) / Math.PI - 90}) translate(${d.y},0)`,
            );

        /* Player nodes: mugshot images, counter-rotated to stay upright */
        const playerG = node
            .append('g')
            .attr('transform', (d) => `rotate(${90 - (d.x * 180) / Math.PI})`);

        playerG
            .append('image')
            .attr('href', (d) => `/api/footy/player/${d.data.id}/mugshot`)
            .attr('x', -MUGSHOT_SIZE / 2)
            .attr('y', -MUGSHOT_SIZE / 2)
            .attr('width', MUGSHOT_SIZE)
            .attr('height', MUGSHOT_SIZE)
            .attr('clip-path', 'url(#mugshot-clip)')
            .attr('preserveAspectRatio', 'xMidYMid slice');

        /* Thin border ring around each mugshot for clarity */
        playerG
            .append('circle')
            .attr('r', MUGSHOT_SIZE / 2)
            .attr('fill', 'none')
            .attr('stroke', '#ccc')
            .attr('stroke-width', 1);

        /*
         * Overlay group rendered last so cloned nodes paint on top of
         * everything. Pointer events are disabled so the original nodes
         * continue to receive hover/click events uninterrupted.
         */
        const overlay = svg
            .append('g')
            .attr('class', 'overlay')
            .style('pointer-events', 'none');

        /* Hover + click behaviour on all nodes */
        node
            .style('cursor', 'pointer')
            .on('mouseenter', (_event: MouseEvent, d) => {
                /* Clone this node into the overlay so it paints on top. */
                const el = _event.currentTarget as Element;
                overlay.node()?.appendChild(el.cloneNode(true));
                /* Convert radial position to Cartesian relative to SVG. */
                const angle = d.x - Math.PI / 2;
                const x = Math.cos(angle) * d.y + cx;
                const y = Math.sin(angle) * d.y + cy;
                setTooltip({ x, y, name: d.data.name });
            })
            .on('mouseleave', () => {
                overlay.selectAll('*').remove();
                setTooltip(null);
            })
            .on('click', (_event, d) => {
                window.location.href = `/footy/player/${d.data.id}`;
            });
    }, [data, width]);

    return (
        <Box ref={containerRef} pos="relative" data-testid="family-tree">
            <svg ref={svgRef} />
            {tooltip ? (
                <Tooltip label={tooltip.name} opened withArrow>
                    <Box
                        pos="absolute"
                        left={tooltip.x}
                        top={tooltip.y}
                        w={1}
                        h={1}
                        pe="none"
                    />
                </Tooltip>
            ) : null}
        </Box>
    );
};
