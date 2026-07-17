'use client';

import { Container, Table, Text } from '@mantine/core';
import { useEffect, useState } from 'react';

import classes from './DebugFontSizes.module.css';

export interface FontSizeTarget {
    /** Human-readable name shown in the overlay */
    label: string;
    /** CSS selector used to find a live element to measure */
    selector: string;
}

export interface DebugFontSizesProps {
    /** Elements to sample the computed font-size of, e.g. fluid/clamp() text */
    targets: FontSizeTarget[];
}

interface Sample extends FontSizeTarget {
    fontSizePx: number | null;
    matches: number;
}

function getRootFontSizePx(): number {
    if (typeof document === 'undefined') return 16;
    return parseFloat(getComputedStyle(document.documentElement).fontSize);
}

function measure(targets: FontSizeTarget[]): Sample[] {
    return targets.map(({ label, selector }) => {
        const elements = document.querySelectorAll<HTMLElement>(selector);
        const first = elements[0];

        return {
            label,
            selector,
            fontSizePx: first ? parseFloat(getComputedStyle(first).fontSize) : null,
            matches: elements.length,
        };
    });
}

export const DebugFontSizes = ({ targets }: DebugFontSizesProps) => {
    const [viewportWidth, setViewportWidth] = useState(0);
    const [pxPerEm, setPxPerEm] = useState(getRootFontSizePx);
    const [samples, setSamples] = useState<Sample[]>([]);

    useEffect(() => {
        const update = () => {
            setViewportWidth(window.innerWidth);
            // Root font size can change with browser zoom, so re-read it on
            // every update rather than once - clamp() reacts to both.
            setPxPerEm(getRootFontSizePx());
            setSamples(measure(targets));
        };

        update();
        window.addEventListener('resize', update);
        // Pinch-zoom on mobile/trackpad doesn't always fire `resize`.
        window.visualViewport?.addEventListener('resize', update);

        return () => {
            window.removeEventListener('resize', update);
            window.visualViewport?.removeEventListener('resize', update);
        };
    }, [targets]);

    return (
        <Container className={classes.div}>
            <Text className={classes.p}>
                🔤 <strong>Font sizes</strong> — viewport: {viewportWidth}px / {(viewportWidth / pxPerEm).toFixed(2)}em
            </Text>
            <Table className={classes.table}>
                <Table.Tbody>
                    {samples.map((sample) => (
                        <Table.Tr key={sample.selector}>
                            <Table.Td className={classes.td}>{sample.label}</Table.Td>
                            <Table.Td className={classes.td}>
                                {sample.fontSizePx === null ?
                                    'no match' :
                                    `${sample.fontSizePx.toFixed(2)}px / ${(sample.fontSizePx / pxPerEm).toFixed(3)}rem`}
                            </Table.Td>
                            <Table.Td className={classes.td}>
                                {sample.matches > 1 ? `(${sample.matches} matches)` : null}
                            </Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        </Container>
    );
};
