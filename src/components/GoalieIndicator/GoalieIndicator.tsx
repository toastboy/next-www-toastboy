'use client';

import { Flex, MantineBreakpoint, Tooltip } from '@mantine/core';
import { IconHandStop } from '@tabler/icons-react';

export interface Props {
    /** Breakpoint above which the indicator is hidden (optional) */
    hiddenFrom?: MantineBreakpoint;
    /** Breakpoint below which the indicator is hidden (optional) */
    visibleFrom?: MantineBreakpoint;
}

export const GoalieIndicator = ({ hiddenFrom, visibleFrom }: Props) => (
    <Tooltip
        label="Goalie"
        withArrow
    >
        <Flex
            role="img"
            aria-label="Goalie indicator"
            display="inline-flex"
            justify="flex-start"
            align="center"
            hiddenFrom={hiddenFrom}
            visibleFrom={visibleFrom}
        >
            <IconHandStop
                stroke={1.25}
                color="black"
                fill="white"
                style={{ height: 'auto', transform: 'scaleX(-1)' }}
                size="1rem"
            />
            <IconHandStop
                stroke={1.25}
                color="black"
                fill="white"
                style={{ height: 'auto' }}
                size="1rem"
            />
        </Flex>
    </Tooltip>
);
