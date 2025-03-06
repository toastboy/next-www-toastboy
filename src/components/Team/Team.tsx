import { Flex, Paper } from '@mantine/core';
import TeamPlayer from 'components/TeamPlayer/TeamPlayer';
import { OutcomeWithPlayer } from 'lib/types';

export interface Props {
    team: OutcomeWithPlayer[];
}

const Team: React.FC<Props> = ({ team }) => {
    return (
        <Paper p="md" shadow="xl">
            <Flex direction="column" gap="md">
                {team.map((o) => (
                    <TeamPlayer key={o.playerId} player={o.player} gameDayId={o.gameDayId} goalie={o.goalie} />
                ))}
            </Flex>
        </Paper>
    );
};

export default Team;
