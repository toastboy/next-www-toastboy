import { Progress } from '@mantine/core';
import { FootyPlayerData } from 'lib/swr';

interface PlayerTileProps {
    player: FootyPlayerData;
}

const PlayerTimeline: React.FC<PlayerTileProps> = ({ player }) => {
    const firstGame = 1;
    const lastGame = 1197;

    const sections = new Array<number>(5);

    // TODO: This is a bit of a mess

    sections[0] = (player.firstResponded || firstGame) - firstGame;
    sections[1] = (player.firstPlayed || firstGame) - sections[0];
    sections[2] = (player.lastPlayed || firstGame) - sections[0] - sections[1];
    sections[3] = (player.lastResponded || firstGame) - sections[0] - sections[1] - sections[2];
    sections[4] = (lastGame - sections[0] - sections[1] - sections[2] - sections[3]);

    return (
        <Progress.Root size="xl">
            <Progress.Section value={sections[0]} color="gray.2">
            </Progress.Section>
            <Progress.Section value={sections[1]} color="cyan.2">
            </Progress.Section>
            <Progress.Section value={sections[2]} color="orange.4">
            </Progress.Section>
            <Progress.Section value={sections[3]} color="cyan.2">
            </Progress.Section>
            <Progress.Section value={sections[4]} color="gray.2">
            </Progress.Section>
        </Progress.Root>
    );
};

export default PlayerTimeline;