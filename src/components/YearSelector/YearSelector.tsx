'use client';

import { Flex, FloatingIndicator, ScrollArea, UnstyledButton } from '@mantine/core';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import classes from './YearSelector.module.css';

export interface Props {
    activeYear: number;
    validYears: number[];
}

const YearSelector: React.FC<Props> = ({ activeYear, validYears }) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const controlsRefs = useRef<HTMLButtonElement[]>([]);
    const [active, setActive] = useState(-1);

    const router = useRouter();
    const pathname = usePathname();

    // Update active index when activeYear or validYears change
    useEffect(() => {
        const index = validYears.indexOf(activeYear);
        if (index >= 0) {
            setActive(index);
        }
    }, [activeYear, validYears]);

    // Stable callback for setting refs for each control
    const setControlRef = useCallback((node: HTMLButtonElement | null, index: number) => {
        if (node) {
            controlsRefs.current[index] = node;
        }
    }, []);

    // Handle button click to update active index and navigate to a new path
    const handleClick = (year: number, index: number) => {
        setActive(index);
        const newPath = `${pathname.replace(/\/\d+$/, '')}/${year || ''}`;
        router.push(newPath);
    };

    return (
        <ScrollArea h={'5.4rem'} type="auto">
            <Flex direction="row" wrap="wrap" gap="md" w="100%" className={classes.root} ref={rootRef}>
                {validYears.map((year, index) => (
                    <UnstyledButton
                        key={year}
                        className={classes.control}
                        ref={(node) => setControlRef(node, index)}
                        onClick={() => handleClick(year, index)}
                        mod={{ active: active === index }}
                    >
                        <span className={classes.controlLabel}>
                            {year === 0 ? "All" : year}
                        </span>
                    </UnstyledButton>
                ))}

                <FloatingIndicator
                    target={controlsRefs.current[active]}
                    parent={rootRef.current}
                    className={classes.indicator}
                />
            </Flex>
        </ScrollArea>
    );
};

export default YearSelector;
