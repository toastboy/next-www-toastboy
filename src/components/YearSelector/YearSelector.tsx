'use client';

import { Flex, FloatingIndicator, ScrollArea, UnstyledButton } from '@mantine/core';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import classes from './YearSelector.module.css';

export interface Props {
    activeYear: number;
    validYears: number[];
}

export const YearSelector: React.FC<Props> = ({ activeYear, validYears }) => {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const controlsRefs = useRef<HTMLButtonElement[]>([]);
    const activeIndex = validYears.indexOf(activeYear);
    const [indicatorParent, setIndicatorParent] = useState<HTMLElement | null>(null);
    const [indicatorTarget, setIndicatorTarget] = useState<HTMLElement | null>(null);
    const [mounted, setMounted] = useState(false);

    const router = useRouter();
    const pathname = usePathname();

    // Stable callback for setting refs for each control
    const setControlRef = useCallback((node: HTMLButtonElement | null, index: number) => {
        if (node) {
            controlsRefs.current[index] = node;
        }
    }, []);

    // Handle button click to update active index and navigate to a new path
    const handleClick = (year: number, index: number) => {
        setIndicatorTarget(controlsRefs.current[index] ?? null);
        const newPath = `${pathname.replace(/\/\d+$/, '')}/${year || ''}`;
        router.push(newPath);
    };

    useEffect(() => {
        setMounted(true);
        if (rootRef.current) {
            setIndicatorParent(rootRef.current);
        }
    }, []);

    useEffect(() => {
        if (activeIndex < 0) {
            setIndicatorTarget(null);
            return;
        }
        setIndicatorTarget(controlsRefs.current[activeIndex] ?? null);
    }, [activeIndex]);

    return (
        <ScrollArea h={'5.4rem'} type="auto">
            <Flex
                direction="row"
                wrap="wrap"
                gap="md"
                w="100%"
                className={classes.root}
                ref={(el) => {
                    rootRef.current = el;
                }}
            >
                {validYears.map((year, index) => (
                    <UnstyledButton
                        key={year}
                        className={classes.control}
                        ref={(node) => setControlRef(node, index)}
                        onClick={() => handleClick(year, index)}
                        mod={{ active: activeIndex === index }}
                    >
                        <span className={classes.controlLabel}>
                            {year === 0 ? "All" : year}
                        </span>
                    </UnstyledButton>
                ))}

                {mounted && indicatorParent && indicatorTarget ? (
                    <FloatingIndicator
                        target={indicatorTarget}
                        parent={indicatorParent}
                        className={classes.indicator}
                        bg="black"
                    />
                ) : null}
            </Flex>
        </ScrollArea>
    );
};
