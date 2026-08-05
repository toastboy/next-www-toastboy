'use client';

import {
    Flex,
    Tooltip,
} from '@mantine/core';
import { IconHandStop } from '@tabler/icons-react';

export const GoalieIndicator = () => (
    <Tooltip label="Goalie" withArrow>
        <Flex
            role="img"
            aria-label="Goalie indicator"
            display="inline-flex"
            justify="flex-start"
            align="center"
            ms="0.25rem"
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
