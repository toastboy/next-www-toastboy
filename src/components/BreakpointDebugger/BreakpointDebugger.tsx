"use client";

import { Container, Text, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import classes from './BreakpointDebugger.module.css';

const BreakpointDebugger = () => {
    const theme = useMantineTheme();

    // Define media queries for each breakpoint
    const isXs = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
    const isSm = useMediaQuery(`(min-width: ${theme.breakpoints.sm}) and (max-width: ${theme.breakpoints.md})`);
    const isMd = useMediaQuery(`(min-width: ${theme.breakpoints.md}) and (max-width: ${theme.breakpoints.lg})`);
    const isLg = useMediaQuery(`(min-width: ${theme.breakpoints.lg}) and (max-width: ${theme.breakpoints.xl})`);
    const isXl = useMediaQuery(`(min-width: ${theme.breakpoints.xl})`);

    const [currentBreakpoint, setCurrentBreakpoint] = useState("Unknown");

    useEffect(() => {
        if (isXs) setCurrentBreakpoint("XS (<sm)");
        else if (isSm) setCurrentBreakpoint("SM (sm)");
        else if (isMd) setCurrentBreakpoint("MD (md)");
        else if (isLg) setCurrentBreakpoint("LG (lg)");
        else if (isXl) setCurrentBreakpoint("XL+ (xl)");

        console.log(`Active Breakpoint: ${currentBreakpoint}`);
    }, [isXs, isSm, isMd, isLg, isXl, currentBreakpoint]);

    return (
        <Container className={classes.div}        >
            <Text className={classes.p}>📏 <strong>Breakpoints</strong>: {JSON.stringify(theme.breakpoints)}</Text>
            <Text className={classes.p}>🔍 <strong>Current</strong>: {currentBreakpoint}</Text>
        </Container>
    );
};

export default BreakpointDebugger;
