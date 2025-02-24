'use client';

import { FloatingIndicator, UnstyledButton } from '@mantine/core';
import classes from 'components/GameYears/GameYears.module.css';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

interface Props {
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
        console.log("Navigating from", pathname, "to", newPath);
        router.push(newPath);
    };

    return (
        <div className={classes.root} ref={rootRef}>
            {validYears.map((year, index) => (
                <UnstyledButton
                    key={year}
                    className={classes.control}
                    ref={(node) => setControlRef(node, index)}
                    onClick={() => handleClick(year, index)}
                    mod={{ active: active === index }}
                >
                    <span className={classes.controlLabel}>
                        {year === 0 ? "All-time" : year}
                    </span>
                </UnstyledButton>
            ))}

            <FloatingIndicator
                target={controlsRefs.current[active]}
                parent={rootRef.current}
                className={classes.indicator}
            />
        </div>
    );
};

export default YearSelector;
