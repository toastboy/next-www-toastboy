import { Progress, Tooltip } from '@mantine/core';
import { FootyPlayerData } from 'lib/swr';

interface Props {
    player: FootyPlayerData;
}

const PlayerWDLChart: React.FC<Props> = ({ player }) => {
    return (
        <Progress.Root size="xl">
            <Tooltip label={`${player.gamesWon} wins`} position="top">
                <Progress.Section value={100.0 * player.gamesWon / player.gamesPlayed} color="green" />
            </Tooltip>
            <Tooltip label={`${player.gamesDrawn} draws`} position="top">
                <Progress.Section value={100.0 * player.gamesDrawn / player.gamesPlayed} color="yellow" />
            </Tooltip>
            <Tooltip label={`${player.gamesLost} losses`} position="top">
                <Progress.Section value={100.0 * player.gamesLost / player.gamesPlayed} color="red" />
            </Tooltip>
        </Progress.Root>
    );
};

export default PlayerWDLChart;
