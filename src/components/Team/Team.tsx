import { Flex, Paper } from '@mantine/core';
import { TeamPlayer } from 'components/TeamPlayer/TeamPlayer';

import { TeamPlayerType } from '@/types';

export interface Props {
    team: TeamPlayerType[];
}

const Team: React.FC<Props> = ({ team }) => {
    return (
        <Paper p="md" shadow="xl">
            <Flex direction="column" gap="md">
                {team.map((p) => (
                    <TeamPlayer
                        key={p.id}
                        teamPlayer={p}
                    />
                ))}
            </Flex>
        </Paper>
    );
};

export default Team;
