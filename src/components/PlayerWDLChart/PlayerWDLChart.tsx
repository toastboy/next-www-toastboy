import { Progress, Tooltip } from '@mantine/core';
import { PlayerDataType } from 'types';

export interface Props {
    player: PlayerDataType;
}

const PlayerWDLChart: React.FC<Props> = ({ player }) => {
    return (
        <Progress.Root size="xl">
            <Tooltip
                label={`${player.gamesWon}
                win${player.gamesWon > 1 ? 's' : ''}`}
                position="top"
            >
                <Progress.Section
                    value={100.0 * player.gamesWon / player.gamesPlayed}
                    color="green"
                />
            </Tooltip>
            <Tooltip
                label={`${player.gamesDrawn} draw${player.gamesDrawn > 1 ? 's' : ''}`}
                position="top"
            >
                <Progress.Section
                    value={100.0 * player.gamesDrawn / player.gamesPlayed}
                    color="yellow"
                />
            </Tooltip>
            <Tooltip
                label={`${player.gamesLost} loss${player.gamesLost > 1 ? 'es' : ''}`}
                position="top"
            >
                <Progress.Section
                    value={100.0 * player.gamesLost / player.gamesPlayed}
                    color="red"
                />
            </Tooltip>
        </Progress.Root>
    );
};

export default PlayerWDLChart;
