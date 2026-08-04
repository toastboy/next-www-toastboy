'use client';

import {
    Progress,
    Tooltip,
} from '@mantine/core';

import { PlayerDataType } from '@/types';

export interface Props {
    player: PlayerDataType;
}

export const PlayerWDLChart = ({ player }: Props) => {
    // A player who hasn't played yet has gamesPlayed === 0; fall back to 1 so the
    // percentages below compute to 0 instead of NaN/Infinity (0/0 or n/0).
    const gamesPlayed = player.gamesPlayed || 1;

    return (
        <Tooltip
            label={`P${player.gamesPlayed} W${player.gamesWon} D${player.gamesDrawn} L${player.gamesLost}`}
            position="top"
        >
            <Progress.Root size="xl">
                <Progress.Section
                    value={100.0 * player.gamesWon / gamesPlayed}
                    color="green"
                />
                <Progress.Section
                    value={100.0 * player.gamesDrawn / gamesPlayed}
                    color="yellow"
                />
                <Progress.Section
                    value={100.0 * player.gamesLost / gamesPlayed}
                    color="red"
                />
            </Progress.Root>
        </Tooltip>
    );
};
