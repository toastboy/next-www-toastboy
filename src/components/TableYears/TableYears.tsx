'use client';

import { FloatingIndicator, UnstyledButton } from '@mantine/core';
import classes from 'components/GameYears/GameYears.module.css'; // TODO: This smells
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Props {
    activeYear: number;
    tableYears: number[];
}

const TableYears: React.FC<Props> = ({ activeYear, tableYears }) => {
    const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
    const [controlsRefs, setControlsRefs] = useState<Record<string, HTMLButtonElement | null>>({});
    const [active, setActive] = useState(0);

    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (tableYears) {
            setActive(tableYears.indexOf(activeYear));
        }
    }, [activeYear, tableYears]);

    const setControlRef = (index: number) => (node: HTMLButtonElement) => {
        controlsRefs[index] = node;
        setControlsRefs(controlsRefs);
    };

    const controls = tableYears.map((year, index) => (
        <UnstyledButton
            key={year}
            className={classes.control}
            ref={setControlRef(index)}
            onClick={() => {
                setActive(index);
                const newPath = pathname.replace(/\/\d+$/, `/${year}`) || `${pathname}/${year}`;
                router.push(newPath);
            }}
            mod={{ active: active === index }}
        >
            <span className={classes.controlLabel}>{year == 0 ? "All-time" : year}</span>
        </UnstyledButton>
    ));

    return (
        <div className={classes.root} ref={setRootRef}>
            {controls}

            <FloatingIndicator
                target={controlsRefs[active]}
                parent={rootRef}
                className={classes.indicator}
            />
        </div>
    );
};

export default TableYears;
