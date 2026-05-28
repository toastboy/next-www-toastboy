import { Box, Flex, Tooltip } from '@mantine/core';
import { IconHandStop } from '@tabler/icons-react';

import { CX, CY, RING_RADIUS } from '@/components/PlayerForm/PlayerForm';

// Position at the bottom-centre of the PlayerForm arc ring, which is the gap
// between the oldest and most recent result dashes.
const left = `${CX}%`;
const top = `${CY + RING_RADIUS}%`;

export const GoalieIndicator = () => (
    <Tooltip label="Goalie" withArrow>
        <Flex
            role="img"
            aria-label="Goalie indicator"
            pos="absolute"
            w="24%"
            style={{
                left,
                top,
                transform: 'translate(-50%, -50%)',
                filter: 'drop-shadow(0 0 2px white) drop-shadow(0 0 2px white)',
            }}
            gap="4%"
            justify="center"
            align="center"
        >
            <Box w="48%">
                <IconHandStop
                    stroke={1.25}
                    color="black"
                    fill="white"
                    style={{ width: '100%', height: 'auto', display: 'block', transform: 'scaleX(-1)' }}
                />
            </Box>
            <Box w="48%">
                <IconHandStop
                    stroke={1.25}
                    color="black"
                    fill="white"
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                />
            </Box>
        </Flex>
    </Tooltip>
);
