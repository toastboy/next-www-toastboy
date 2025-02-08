'use client';

import { FloatingIndicator, Loader, UnstyledButton } from '@mantine/core';
import classes from 'components/GameYears/GameYears.module.css'; // TODO: This smells
import { usePlayerYearsActive } from 'lib/swr';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

interface PlayerYearsActiveProps {
    idOrLogin: string;
    activeYear: number;
    onYearChange: Dispatch<SetStateAction<number>>;
}

const PlayerYearsActive: React.FC<PlayerYearsActiveProps> = ({
    idOrLogin,
    activeYear,
    onYearChange,
}) => {
    const { data, error, isLoading } = usePlayerYearsActive(idOrLogin);

    const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
    const [controlsRefs, setControlsRefs] = useState<Record<string, HTMLButtonElement | null>>({});
    const [active, setActive] = useState(0);

    useEffect(() => {
        if (data) {
            setActive(data.indexOf(activeYear));
        }
    }, [activeYear, data]);

    if (isLoading) return <Loader color="gray" type="dots" />;
    if (error || !data) return <div>failed to load</div>;

    const setControlRef = (index: number) => (node: HTMLButtonElement) => {
        controlsRefs[index] = node;
        setControlsRefs(controlsRefs);
    };

    const controls = data.map((year, index) => (
        <UnstyledButton
            key={year}
            className={classes.control}
            ref={setControlRef(index)}
            onClick={() => {
                setActive(index);
                onYearChange(year);
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

export default PlayerYearsActive;
