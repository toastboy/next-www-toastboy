import { ProgressRoot, ProgressSection } from '@mantine/core';
import { PlayerData } from 'lib/types';

interface Props {
    player: PlayerData;
    currentGameId: number;
}

const PlayerTimeline: React.FC<Props> = ({ player, currentGameId }) => {
    const firstGame = 1;
    const lastGame = currentGameId;

    return (
        <ProgressRoot size="xl">
            <ProgressSection value={(player.firstResponded ?? firstGame) - firstGame} color="gray.2" />
            <ProgressSection value={(player.firstPlayed ?? firstGame) - (player.firstResponded ?? firstGame)} color="cyan.2" />
            <ProgressSection value={(player.lastPlayed ?? firstGame) - (player.firstPlayed ?? firstGame)} color="orange.4" />
            <ProgressSection value={(player.lastResponded ?? firstGame) - (player.lastPlayed ?? firstGame)} color="cyan.2" />
            <ProgressSection value={lastGame - (player.lastResponded ?? firstGame)} color="gray.2" />
        </ProgressRoot>
    );
};

export default PlayerTimeline;
