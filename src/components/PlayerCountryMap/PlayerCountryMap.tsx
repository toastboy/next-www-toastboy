'use client';

import {
    Anchor,
    Box,
    Group,
    Image,
    Popover,
    ScrollArea,
    Stack,
    Text,
} from '@mantine/core';
import * as d3 from 'd3';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as topojson from 'topojson-client';
import type { GeometryCollection, Topology } from 'topojson-specification';

import { CountrySupporterWithPlayerDataType } from '@/types';

/**
 * Mapping from database country names to their corresponding TopoJSON atlas
 * names where they differ. Multiple DB names may map to the same atlas entry
 * (e.g. the four UK home nations all map to "United Kingdom").
 */
const COUNTRY_NAME_MAP: Record<string, string> = {
    'England': 'United Kingdom',
    'Northern Ireland': 'United Kingdom',
    'Scotland': 'United Kingdom',
    'Wales': 'United Kingdom',
    'Russian Federation': 'Russia',
    'Bosnia and Herzegovina': 'Bosnia and Herz.',
    'Central African Republic': 'Central African Rep.',
    'Dominican Republic': 'Dominican Rep.',
    'Equatorial Guinea': 'Eq. Guinea',
    'Swaziland': 'eSwatini',
    'United States': 'United States of America',
};

/**
 * Properties for the {@link PlayerCountryMap} component.
 */
export interface Props {
    /** Array of country supporter entries with player data for highlighting and hover. */
    countries: CountrySupporterWithPlayerDataType[];
    /** Width of the SVG viewport in pixels. */
    width?: number;
    /** Height of the SVG viewport in pixels. */
    height?: number;
}

/** Shape of properties on each country feature in the TopoJSON atlas. */
interface CountryProperties {
    name: string;
}

/** Fill colour applied to highlighted (supported) countries. */
const HIGHLIGHT_FILL = '#228be6';
/** Fill colour for countries that are not highlighted. */
const DEFAULT_FILL = '#ccc';
/** Stroke colour for country borders. */
const STROKE_COLOUR = '#fff';
/** Stroke width for country borders. */
const STROKE_WIDTH = 0.5;
/** Maximum height of the scrollable player list inside the hover popover. */
const POPOVER_MAX_HEIGHT = 200;
/** Size of mugshot thumbnails in the hover popover. */
const MUGSHOT_SIZE = 32;
/** Delay in ms before closing the popover after mouse leaves a country path. */
const CLOSE_DELAY_MS = 200;

/**
 * Resolves a database country name to its TopoJSON atlas equivalent.
 * Returns the mapped name if one exists, or the original name otherwise.
 */
const toAtlasName = (dbName: string): string =>
    COUNTRY_NAME_MAP[dbName] ?? dbName;

/**
 * A D3-powered world map that highlights countries supported by players and
 * shows player mugshots in a popover on hover.
 *
 * Renders all countries from a TopoJSON world atlas and fills those whose
 * names match the supplied supporter entries with an accent colour. When a
 * highlighted country is hovered, a popover displays the mugshot and name of
 * each supporting player, grouped by their database country name (useful
 * when multiple nations share one atlas polygon, e.g. the four UK home
 * nations). For countries with many supporters the list is scrollable.
 *
 * Based on the approach described at
 * {@link http://www.d3noob.org/2013/03/a-simple-d3js-map-explained.html}.
 */
export const PlayerCountryMap = ({
    countries,
    width = 960,
    height = 500,
}: Props) => {
    const svgRef = useRef<SVGSVGElement>(null);
    /** Projected centroids for each highlighted atlas country. */
    const centroidsRef = useRef<Map<string, { x: number; y: number }>>(new Map());
    /** Timer handle for the delayed popover close. */
    const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    /** Whether the mouse is currently inside the popover dropdown. */
    const dropdownHoveredRef = useRef(false);
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [popoverPos, setPopoverPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

    /**
     * Builds a lookup from lower-cased atlas country name to an array of
     * supporters. Multiple DB country names that share the same atlas name
     * are grouped together.
     */
    const supportersByAtlasName = useMemo(() => {
        const map = new Map<string, CountrySupporterWithPlayerDataType[]>();
        for (const cs of countries) {
            const key = toAtlasName(cs.country.name).toLowerCase();
            const arr = map.get(key) ?? [];
            arr.push(cs);
            map.set(key, arr);
        }
        return map;
    }, [countries]);

    /**
     * Returns the supporters for the currently hovered country, grouped by
     * their original database country name for display purposes.
     */
    const hoveredGroups = useMemo(() => {
        if (!hoveredCountry) return [];
        const supporters = supportersByAtlasName.get(hoveredCountry) ?? [];
        const grouped = new Map<string, CountrySupporterWithPlayerDataType[]>();
        for (const s of supporters) {
            const key = s.country.name;
            const arr = grouped.get(key) ?? [];
            arr.push(s);
            grouped.set(key, arr);
        }
        return Array.from(grouped.entries());
    }, [hoveredCountry, supportersByAtlasName]);

    /** Cancels any pending delayed close. */
    const cancelClose = useCallback(() => {
        if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
        }
    }, []);

    /** Schedules a delayed popover close unless the dropdown is hovered. */
    const scheduleClose = useCallback(() => {
        cancelClose();
        closeTimerRef.current = setTimeout(() => {
            if (!dropdownHoveredRef.current) {
                setPopoverOpen(false);
                setHoveredCountry(null);
            }
        }, CLOSE_DELAY_MS);
    }, [cancelClose]);

    /**
     * Handles mouse-enter on a highlighted country path. Anchors the popover
     * to the country's projected centroid for a stable position.
     */
    const handleMouseEnter = useCallback(
        (atlasName: string) => {
            cancelClose();
            const lowerName = atlasName.toLowerCase();
            const centroid = centroidsRef.current.get(lowerName);
            if (centroid) {
                setPopoverPos(centroid);
            }
            setHoveredCountry(lowerName);
            setPopoverOpen(true);
        },
        [cancelClose],
    );

    /** Handles mouse-leave on a highlighted country path. */
    const handleMouseLeave = useCallback(() => {
        scheduleClose();
    }, [scheduleClose]);

    useEffect(() => {
        if (!svgRef.current) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const projection = d3.geoMercator()
            .center([0, 20])
            .scale(width / 6.5)
            .translate([width / 2, height / 2]);

        const path = d3.geoPath().projection(projection);

        const g = svg.append('g');

        const supportedNames = new Set(supportersByAtlasName.keys());

        void d3.json<Topology>('/countries-110m.json').then((topology) => {
            if (!topology) return undefined;

            const geojson = topojson.feature(
                topology,
                topology.objects.countries as GeometryCollection,
            );

            type CountryFeature = GeoJSON.Feature<GeoJSON.Geometry, CountryProperties>;
            const features = geojson.features as CountryFeature[];

            /* Pre-compute projected centroids for highlighted countries so
               the popover can be anchored to a stable position. */
            const newCentroids = new Map<string, { x: number; y: number }>();
            for (const f of features) {
                const name = (f.properties?.name ?? '').toLowerCase();
                if (supportedNames.has(name)) {
                    const [cx, cy] = path.centroid(f);
                    newCentroids.set(name, { x: cx, y: cy });
                }
            }
            centroidsRef.current = newCentroids;

            g.selectAll<SVGPathElement, CountryFeature>('path')
                .data(features)
                .enter()
                .append('path')
                .attr('d', path)
                .attr('fill', (d) => {
                    const name = (d.properties?.name ?? '').toLowerCase();
                    return supportedNames.has(name) ?
                        HIGHLIGHT_FILL :
                        DEFAULT_FILL;
                })
                .attr('stroke', STROKE_COLOUR)
                .attr('stroke-width', STROKE_WIDTH)
                .on('mouseenter', function (_event: MouseEvent, d) {
                    const name = (d.properties?.name ?? '').toLowerCase();
                    if (supportedNames.has(name)) {
                        handleMouseEnter(name);
                    }
                })
                .on('mouseleave', function () {
                    handleMouseLeave();
                });

            return undefined;
        });
    }, [countries, width, height, supportersByAtlasName, handleMouseEnter, handleMouseLeave]);

    return (
        <Box pos="relative" data-testid="player-country-map">
            <svg
                ref={svgRef}
                width={width}
                height={height}
            />
            <Popover
                opened={popoverOpen}
                position="bottom"
                withArrow
                shadow="md"
                withinPortal={false}
            >
                <Popover.Target>
                    <Box
                        pos="absolute"
                        left={popoverPos.x}
                        top={popoverPos.y}
                        w={1}
                        h={1}
                        pe="none"
                    />
                </Popover.Target>
                <Popover.Dropdown
                    onMouseEnter={() => {
                        dropdownHoveredRef.current = true;
                        cancelClose();
                    }}
                    onMouseLeave={() => {
                        dropdownHoveredRef.current = false;
                        scheduleClose();
                    }}
                    pe="auto"
                >
                    <ScrollArea.Autosize mah={POPOVER_MAX_HEIGHT}>
                        <Stack gap="xs">
                            {hoveredGroups.map(([countryName, supporters]) => (
                                <Stack key={countryName} gap={4}>
                                    <Text size="xs" fw={700}>{countryName}</Text>
                                    {supporters.map((s) => (
                                        <Anchor
                                            key={s.playerId}
                                            href={`/footy/player/${s.playerId}`}
                                            underline="never"
                                        >
                                            <Group gap="xs" wrap="nowrap">
                                                <Image
                                                    src={`/api/footy/player/${s.playerId}/mugshot`}
                                                    alt={s.player.name ?? `Player ${s.playerId}`}
                                                    w={MUGSHOT_SIZE}
                                                    h={MUGSHOT_SIZE}
                                                    radius="xl"
                                                />
                                                <Text size="sm">
                                                    {s.player.name ?? `Player ${s.playerId}`}
                                                </Text>
                                            </Group>
                                        </Anchor>
                                    ))}
                                </Stack>
                            ))}
                        </Stack>
                    </ScrollArea.Autosize>
                </Popover.Dropdown>
            </Popover>
        </Box>
    );
};
