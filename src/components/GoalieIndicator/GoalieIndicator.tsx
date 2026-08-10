'use client';

import {
    Flex,
    MantineBreakpoint,
    Tooltip,
} from '@mantine/core';
import { IconHandStop } from '@tabler/icons-react';

export interface Props {
    /** Breakpoint above which the indicator is hidden (optional) */
    hiddenFrom?: MantineBreakpoint;
    /** Breakpoint below which the indicator is hidden (optional) */
    visibleFrom?: MantineBreakpoint;
    /** Whether the indicator directly follows a player's name inline, which adds a small
     * leading margin to space it from that text (default: true). Set to false when the
     * indicator stands alone, e.g. as a Divider label. */
    inline?: boolean;
}

export const GoalieIndicator = ({ hiddenFrom, visibleFrom, inline = true }: Props) => (
    <Tooltip label="Goalie" withArrow>
        <Flex
            role="img"
            aria-label="Goalie indicator"
            display="inline-flex"
            justify="flex-start"
            align="center"
            ms={inline ? "0.25rem" : undefined}
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
