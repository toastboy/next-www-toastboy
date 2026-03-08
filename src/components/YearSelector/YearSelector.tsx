'use client';

import { Flex, FloatingIndicator, ScrollArea, UnstyledButton } from '@mantine/core';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useRef, useState } from 'react';

import classes from './YearSelector.module.css';

export interface Props {
    activeYear: number;
    validYears: number[];
}

export const YearSelector: React.FC<Props> = ({ activeYear, validYears }) => {
    const controlsRefs = useRef<HTMLAnchorElement[]>([]);
    const activeIndex = validYears.indexOf(activeYear);
    const [indicatorParent, setIndicatorParent] = useState<HTMLElement | null>(null);
    const [indicatorTarget, setIndicatorTarget] = useState<HTMLElement | null>(null);

    const pathname = usePathname();
    const searchParams = useSearchParams();

    /**
     * Creates a URL href string with the specified year as a query parameter.
     *
     * @param year - The year to include in the URL. If 0, the year parameter is
     * removed from the URL.
     * @returns A URL string with updated query parameters. Returns the pathname
     * without query string if no parameters remain.
     *
     * @example
     * ```ts
     * // Current URL: /blog?category=tech&year=2023
     * createYearHref(2024) // Returns: /blog?category=tech&year=2024
     * createYearHref(0)    // Returns: /blog?category=tech
     * ```
     */
    const createYearHref = useCallback((year: number) => {
        const params = new URLSearchParams(searchParams.toString());
        if (year === 0) {
            params.delete('year');
        } else {
            params.set('year', String(year));
        }
        const query = params.toString();
        return query ? `${pathname}?${query}` : pathname;
    }, [pathname, searchParams]);

    /**
     * Callback ref that sets the indicator parent element.
     * Only updates when the node reference changes to prevent unnecessary re-renders.
     *
     * @param node - The HTMLDivElement to set as the indicator parent, or null to clear it
     */
    const setRootRef = useCallback((node: HTMLDivElement | null) => {
        setIndicatorParent((prev) => (node && prev !== node ? node : prev));
    }, []);

    /**
     * Callback ref function that stores anchor element references and updates
     * the indicator target.
     *
     * @param node - The anchor element reference or null if the element is
     * being unmounted
     * @param index - The index of the control in the controls array
     *
     * @remarks
     * This function serves two purposes:
     * 1. Stores the anchor element reference in the controlsRefs array at the
     *    specified index
     * 2. Updates the indicator target when the index matches the active index,
     *    ensuring the indicator position is synchronized with the active
     *    control
     */
    const setControlRef = useCallback((node: HTMLAnchorElement | null, index: number) => {
        if (node) {
            controlsRefs.current[index] = node;
        }
        if (index === activeIndex) {
            setIndicatorTarget((prev) => (prev !== node ? node : prev));
        }
    }, [activeIndex]);

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
                        component="a"
                        href={createYearHref(year)}
                        mod={{ active: activeIndex === index }}
                    >
                        <span className={classes.controlLabel}>
                            {year === 0 ? 'All' : year}
                        </span>
                    </UnstyledButton>
                ))}

                {indicatorParent && indicatorTarget ? (
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
