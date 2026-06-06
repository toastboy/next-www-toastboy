'use client';

import { Box, Paper, Tooltip } from '@mantine/core';
import { ascending, groups } from 'd3-array';
import { hierarchy, type HierarchyPointLink, type HierarchyPointNode, tree } from 'd3-hierarchy';
import { select } from 'd3-selection';
import { linkRadial } from 'd3-shape';
import { type D3ZoomEvent, zoom, zoomIdentity } from 'd3-zoom';
import { useCallback, useEffect, useRef, useState } from 'react';

import { FamilyTreeNodeType } from '@/types';

import { computeTreeRadius } from './familyTreeRadius';

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
/** Minimum gap between adjacent mugshot edges, in tree coordinate pixels. */
const MUGSHOT_GAP = 4;
/** Minimum SVG height in pixels. */
const MIN_HEIGHT = 300;
/**
 * The floor radius passed to computeTreeRadius is (width − padding) / 2 so
 * sparse trees still fill most of the viewport. The padding reserves space for
 * two mugshot radii on each side of the centred tree.
 */
const RADIUS_FLOOR_PADDING = MUGSHOT_SIZE * 4;
/**
 * Hard cap on the computed radius, expressed as a multiple of the container
 * width. computeTreeRadius returns Infinity when two nodes share an angle
 * (zero angular gap — unsatisfiable constraint). Without this cap the
 * subsequent `d.y *= radius` would compute 0 × Infinity = NaN for the root
 * node and propagate NaN into every transform attribute.
 */
const RADIUS_MAX_MULTIPLIER = 4;

/**
 * A D3 radial tidy-tree visualising how players were introduced to the club.
 * The founding player sits at the centre and each generation fans out in
 * concentric rings. Because a tree is always planar, the radial layout
 * algorithm guarantees that no two links cross.
 *
 * The outer radius is computed in two passes: first the tree is laid out with
 * a unit radius to obtain the actual angular positions, then the minimum radius
 * that prevents any two adjacent mugshots from overlapping is derived from
 * those real positions and the y-coordinates are scaled accordingly. This is
 * exact — the naïve approach of dividing the node count at each depth by 2π
 * underestimates the required radius because the tidy-tree algorithm packs
 * nodes within subtree wedges, not uniformly around the full circle.
 *
 * The initial zoom scales the result to fill the available viewport height.
 * Hovering shows the player name in a tooltip; click to open their profile.
 * The chart is zoomable and pannable.
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
    /** Measured container height; drives SVG sizing. */
    const [height, setHeight] = useState(600);

    /** Update the measured dimensions whenever the container resizes. */
    const updateSize = useCallback(() => {
        if (containerRef.current) {
            setWidth(containerRef.current.clientWidth);
            setHeight(containerRef.current.clientHeight);
        }
    }, []);

    useEffect(() => {
        updateSize();
        const ro = new ResizeObserver(updateSize);
        /* v8 ignore next -- containerRef.current is always set after mount; null branch is unreachable */
        if (containerRef.current) ro.observe(containerRef.current);
        return () => ro.disconnect();
    }, [updateSize]);

    useEffect(() => {
        if (!svgRef.current || !containerRef.current) return;

        const hierarchyRoot = hierarchy(data)
            .sort((a, b) => ascending(a.data.name, b.data.name));

        const maxDepth = hierarchyRoot.height;

        /*
         * Pass 1 — lay out with outerRadius = 1 so every node's x is its
         * final angle in [0, 2π] and y is its normalised depth (depth/maxDepth).
         * The x-coordinates are independent of the radius and will not change
         * when we re-scale y in Pass 2.
         */
        const treeLayout = tree<FamilyTreeNodeType>()
            .size([2 * Math.PI, 1])
            .separation((a, b) => (a.parent === b.parent ? 1 : 2) / Math.max(1, a.depth));

        const root = treeLayout(hierarchyRoot);

        /*
         * Pass 2 — derive the smallest outer radius that prevents mugshot
         * overlap at every depth, floored at half the SVG width so sparse
         * trees still fill the space. See familyTreeRadius.ts for the maths.
         *
         * computeTreeRadius returns Infinity when two nodes share an angle
         * (unsatisfiable constraint). Cap at 4× the container width so that
         * the subsequent y-scaling never produces NaN (Infinity × 0).
         */
        const radius = Math.min(
            computeTreeRadius(
                groups(root.descendants(), (d) => d.depth),
                maxDepth,
                Math.max(0, (width - RADIUS_FLOOR_PADDING) / 2),
                MUGSHOT_SIZE,
                MUGSHOT_GAP,
            ),
            width * RADIUS_MAX_MULTIPLIER,
        );

        /* Scale y-coordinates from [0, 1] to [0, radius]. */
        root.each((d) => {
            d.y *= radius;
        });

        const availableHeight = Math.max(MIN_HEIGHT, height);

        const svg = select(svgRef.current);
        svg.selectAll('*').remove();

        svg
            .attr('width', width)
            .attr('height', availableHeight)
            .style('user-select', 'none');

        /* All content lives in this group; zoom transforms it as a unit. */
        const g = svg.append('g');

        const zoomBehaviour = zoom<SVGSVGElement, unknown>()
            .scaleExtent([0.1, 4])
            .on('zoom', (event: D3ZoomEvent<SVGSVGElement, unknown>) => {
                g.attr('transform', event.transform.toString());
            });

        svg.call(zoomBehaviour);

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
        g.append('g')
            .attr('fill', 'none')
            .attr('stroke', LINK_STROKE)
            .attr('stroke-opacity', LINK_STROKE_OPACITY)
            .attr('stroke-width', LINK_STROKE_WIDTH)
            .selectAll('path')
            .data(root.links())
            .join('path')
            .attr(
                'd',
                linkRadial<
                    HierarchyPointLink<FamilyTreeNodeType>,
                    HierarchyPointNode<FamilyTreeNodeType>
                >()
                    .angle((d) => d.x)
                    .radius((d) => d.y),
            );

        /* Nodes */
        const node = g
            .append('g')
            .selectAll<SVGGElement, HierarchyPointNode<FamilyTreeNodeType>>(
                'g',
            )
            .data(root.descendants())
            .join('g')
            .attr(
                'transform',
                (d) =>
                    `rotate(${(d.x * 180) / Math.PI - 90}) translate(${d.y},0)`,
            )
            .style('cursor', 'pointer');

        /* Counter-rotated group so mugshots stay upright regardless of angle. */
        const playerG = node
            .append('g')
            .attr(
                'transform',
                (d) => `rotate(${90 - (d.x * 180) / Math.PI})`,
            );

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
         * Fit the zoom to the actual rendered content rather than an assumed
         * circle diameter. Trees are rarely perfectly circular — branches
         * cluster in sectors — so getBBox() on the content group gives the
         * true bounds and produces a tighter, fuller fit.
         */
        const gNode = g.node();
        /* c8 ignore next — svg.append('g') always returns a non-null element; unreachable via D3's API */
        if (gNode) {
            const b = gNode.getBBox();
            if (b.width > 0 && b.height > 0) {
                const pad = MUGSHOT_SIZE;
                const scale = Math.max(
                    0.1,
                    Math.min(
                        4,
                        (width - 2 * pad) / b.width,
                        (availableHeight - 2 * pad) / b.height,
                    ),
                );
                const tx = (width - b.width * scale) / 2 - b.x * scale;
                const ty =
                    (availableHeight - b.height * scale) / 2 - b.y * scale;
                svg.call(
                    zoomBehaviour.transform,
                    zoomIdentity.translate(tx, ty).scale(scale),
                );
            }
        }

        /* Hover + click behaviour */
        node
            .on('mouseenter', (event: MouseEvent, d) => {
                const rect = svgRef.current!.getBoundingClientRect();
                setTooltip({
                    x: event.clientX - rect.left,
                    y: event.clientY - rect.top,
                    name: d.data.name,
                });
            })
            .on('mouseleave', () => setTooltip(null))
            .on('click', (_event, d) => {
                window.location.href = `/footy/player/${d.data.id}`;
            });
    }, [data, width, height]);

    return (
        <Paper
            shadow="xl"
            ref={containerRef}
            pos="relative"
            data-testid="family-tree"
            w="100%"
            h="70vh"
            style={{ overflow: 'hidden' }}
        >
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
        </Paper>
    );
};
