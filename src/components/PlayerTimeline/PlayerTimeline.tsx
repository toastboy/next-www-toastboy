'use client';

import {
    Progress,
} from '@mantine/core';

import { PlayerDataType } from '@/types';

export interface Props {
    player: PlayerDataType;
    currentGameId: number;
}

export const PlayerTimeline = ({ player, currentGameId }: Props) => {
    const firstGame = 1;
    const lastGame = currentGameId;

    return (
        <Progress.Root size="xl">
            <Progress.Section value={(player.firstResponded ?? firstGame) - firstGame} color="gray.2" />
            <Progress.Section value={(player.firstPlayed ?? firstGame) - (player.firstResponded ?? firstGame)} color="cyan.2" />
            <Progress.Section value={(player.lastPlayed ?? firstGame) - (player.firstPlayed ?? firstGame)} color="orange.4" />
            <Progress.Section value={(player.lastResponded ?? firstGame) - (player.lastPlayed ?? firstGame)} color="cyan.2" />
            <Progress.Section value={lastGame - (player.lastResponded ?? firstGame)} color="gray.2" />
        </Progress.Root>
    );
};
