'use client';

import { Box, Container, Text, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useEffect, useMemo, useRef, useState } from 'react';

import classes from './DebugBreakpoints.module.css';

function getRootFontSizePx(): number {
    if (typeof document === 'undefined') return 16;
    return parseFloat(getComputedStyle(document.documentElement).fontSize);
}

function emToPx(value: string, pxPerEm: number): number {
    return value.endsWith('em') ? parseFloat(value) * pxPerEm : parseFloat(value);
}

function bucketWidth(width: number, breakpoints: { sm: string; md: string; lg: string; xl: string }, pxPerEm: number): string {
    const { sm, md, lg, xl } = breakpoints;
    if (width < emToPx(sm, pxPerEm)) return `XS (<${sm})`;
    if (width < emToPx(md, pxPerEm)) return `SM (${sm})`;
    if (width < emToPx(lg, pxPerEm)) return `MD (${md})`;
    if (width < emToPx(xl, pxPerEm)) return `LG (${lg})`;
    return `XL+ (${xl})`;
}

export const DebugBreakpoints = () => {
    const theme = useMantineTheme();

    // Zero-size marker so we can observe the width of whatever DOM parent
    // this component is dropped into, i.e. the element a `@container` query
    // there would actually be measuring - not this component's own fixed box.
    const markerRef = useRef<HTMLSpanElement>(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const [pxPerEm, setPxPerEm] = useState(getRootFontSizePx);

    useEffect(() => {
        if (typeof ResizeObserver === 'undefined') return;

        const parent = markerRef.current?.parentElement;
        if (!parent) return;

        const observer = new ResizeObserver(([entry]) => {
            setContainerWidth(entry.contentRect.width);
            // Root font size can change with browser zoom or user settings,
            // so re-read it whenever the container resizes rather than once.
            setPxPerEm(getRootFontSizePx());
        });
        observer.observe(parent);

        return () => observer.disconnect();
    }, []);

    // Define media queries for each breakpoint
    const isXs = useMediaQuery(`(max-width: calc(${theme.breakpoints.sm} - 1px))`);
    const isSm = useMediaQuery(`(min-width: ${theme.breakpoints.sm}) and (max-width: calc(${theme.breakpoints.md} - 1px))`);
    const isMd = useMediaQuery(`(min-width: ${theme.breakpoints.md}) and (max-width: calc(${theme.breakpoints.lg} - 1px))`);
    const isLg = useMediaQuery(`(min-width: ${theme.breakpoints.lg}) and (max-width: calc(${theme.breakpoints.xl} - 1px))`);
    const isXl = useMediaQuery(`(min-width: ${theme.breakpoints.xl})`);

    const viewportBreakpoint = useMemo(() => {
        if (isXs) return `XS (<${theme.breakpoints.sm})`;
        if (isSm) return `SM (${theme.breakpoints.sm})`;
        if (isMd) return `MD (${theme.breakpoints.md})`;
        if (isLg) return `LG (${theme.breakpoints.lg})`;
        if (isXl) return `XL+ (${theme.breakpoints.xl})`;
        return "Unknown";
    }, [isXs, isSm, isMd, isLg, isXl, theme.breakpoints]);

    const containerBreakpoint = useMemo(
        () => bucketWidth(containerWidth, theme.breakpoints, pxPerEm),
        [containerWidth, theme.breakpoints, pxPerEm],
    );

    useEffect(() => {
        // Pure side-effect (no setState) -> avoids cascading renders
        // eslint-disable-next-line no-console
        console.log(`Active Breakpoint — viewport: ${viewportBreakpoint}, container: ${containerBreakpoint}`);
    }, [viewportBreakpoint, containerBreakpoint]);

    return (
        <>
            <Box component="span" ref={markerRef} style={{ display: 'none' }} />
            <Container className={classes.div}>
                <Text className={classes.p}>📏 <strong>Breakpoints</strong>: {JSON.stringify(theme.breakpoints)}</Text>
                <Text className={classes.p}>🖥️ <strong>Viewport</strong>: {viewportBreakpoint}</Text>
                <Text className={classes.p}>📦 <strong>Container ({Math.round(containerWidth)}px/{Math.round(containerWidth / pxPerEm)}em)</strong>: {containerBreakpoint}</Text>
            </Container>
        </>
    );
};
