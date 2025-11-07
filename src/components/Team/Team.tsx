import { Flex, Paper } from '@mantine/core';
import TeamPlayer from 'components/TeamPlayer/TeamPlayer';
import { OutcomeType } from 'prisma/generated/schemas/models/Outcome.schema';

export interface Props {
    team: OutcomeType[];
}

const Team: React.FC<Props> = ({ team }) => {
    return (
        <Paper p="md" shadow="xl">
            <Flex direction="column" gap="md">
                {team.map((o) => (
                    <TeamPlayer key={o.playerId} playerId={o.playerId} gameDayId={o.gameDayId} goalie={o.goalie} />
                ))}
            </Flex>
        </Paper>
    );
};

export default Team;
