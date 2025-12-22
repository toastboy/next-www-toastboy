'use client';

import { Flex, FloatingIndicator, ScrollArea, UnstyledButton } from '@mantine/core';
import { usePathname, useRouter } from 'next/navigation';
import { Activity, useCallback, useRef, useState } from 'react';

import classes from './YearSelector.module.css';

export interface Props {
    activeYear: number;
    validYears: number[];
}

export const YearSelector: React.FC<Props> = ({ activeYear, validYears }) => {
    const controlsRefs = useRef<HTMLButtonElement[]>([]);
    const activeIndex = validYears.indexOf(activeYear);
    const [indicatorParent, setIndicatorParent] = useState<HTMLElement | null>(null);
    const [indicatorTarget, setIndicatorTarget] = useState<HTMLElement | null>(null);

    const router = useRouter();
    const pathname = usePathname();

    // Stable callback for setting refs for each control
    // Use ref callbacks to capture DOM nodes without setState in effects.
    const setRootRef = useCallback((node: HTMLDivElement | null) => {
        setIndicatorParent((prev) => (node && prev !== node ? node : prev));
    }, []);

    const setControlRef = useCallback((node: HTMLButtonElement | null, index: number) => {
        if (node) {
            controlsRefs.current[index] = node;
        }
        if (index === activeIndex) {
            setIndicatorTarget((prev) => (prev !== node ? node : prev));
        }
    }, [activeIndex]);

    // Handle button click to update active index and navigate to a new path
    const handleClick = (year: number) => {
        const newPath = `${pathname.replace(/\/\d+$/, '')}/${year || ''}`;
        router.push(newPath);
    };

    return (
        <ScrollArea h={'5.4rem'} type="auto">
            <Flex
                direction="row"
                wrap="wrap"
                gap="md"
                w="100%"
                className={classes.root}
                ref={setRootRef}
            >
                {validYears.map((year, index) => (
                    <UnstyledButton
                        key={year}
                        className={classes.control}
                        ref={(node) => setControlRef(node, index)}
                        onClick={() => handleClick(year)}
                        mod={{ active: activeIndex === index }}
                    >
                        <span className={classes.controlLabel}>
                            {year === 0 ? "All" : year}
                        </span>
                    </UnstyledButton>
                ))}

                <Activity mode={indicatorParent && indicatorTarget ? 'visible' : 'hidden'}>
                    <FloatingIndicator
                        target={indicatorTarget}
                        parent={indicatorParent}
                        className={classes.indicator}
                        bg="black"
                    />
                </Activity>
            </Flex>
        </ScrollArea>
    );
};
