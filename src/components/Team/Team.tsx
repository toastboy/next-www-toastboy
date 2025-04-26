import { Flex, Paper } from '@mantine/core';
import TeamPlayer from 'components/TeamPlayer/TeamPlayer';
import { Outcome } from 'prisma/generated/zod';

export interface Props {
    team: Outcome[];
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
