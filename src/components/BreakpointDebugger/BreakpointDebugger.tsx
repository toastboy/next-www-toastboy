"use client";

import { Container, Text, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useMemo } from "react";

import classes from './BreakpointDebugger.module.css';

export type Props = unknown;

export const BreakpointDebugger: React.FC<Props> = () => {
    const theme = useMantineTheme();

    // Define media queries for each breakpoint
    const isXs = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
    const isSm = useMediaQuery(`(min-width: ${theme.breakpoints.sm}) and (max-width: calc(${theme.breakpoints.md} - 1px))`);
    const isMd = useMediaQuery(`(min-width: ${theme.breakpoints.md}) and (max-width: calc(${theme.breakpoints.lg} - 1px))`);
    const isLg = useMediaQuery(`(min-width: ${theme.breakpoints.lg}) and (max-width: calc(${theme.breakpoints.xl} - 1px))`);
    const isXl = useMediaQuery(`(min-width: ${theme.breakpoints.xl})`);

    const currentBreakpoint = useMemo(() => {
        if (isXs) return "XS (<sm)";
        if (isSm) return "SM (sm)";
        if (isMd) return "MD (md)";
        if (isLg) return "LG (lg)";
        if (isXl) return "XL+ (xl)";
        return "Unknown";
    }, [isXs, isSm, isMd, isLg, isXl]);

    useEffect(() => {
        // Pure side-effect (no setState) -> avoids cascading renders
        console.log(`Active Breakpoint: ${currentBreakpoint}`);
    }, [currentBreakpoint]);

    return (
        <Container className={classes.div}        >
            <Text className={classes.p}>📏 <strong>Breakpoints</strong>: {JSON.stringify(theme.breakpoints)}</Text>
            <Text className={classes.p}>🔍 <strong>Current</strong>: {currentBreakpoint}</Text>
        </Container>
    );
};
