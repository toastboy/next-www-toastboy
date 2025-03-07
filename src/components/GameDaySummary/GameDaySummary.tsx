import { Flex, Text, Title } from '@mantine/core';
import Team from 'components/Team/Team';
import { GameDayWithOutcomesWithPlayers } from 'lib/types';

interface Props {
    gameDay: GameDayWithOutcomesWithPlayers;
}

const GameDaySummary: React.FC<Props> = ({ gameDay }) => {
    if (gameDay.game) {
        return (
            <Flex direction="column">
                <Title order={1}>Game {gameDay.id}: {gameDay.date.toDateString()}</Title>
                <Text>
                    {gameDay.comment ? `(${gameDay.comment})` : ''}
                </Text>
                <Team team={gameDay.outcomes.filter((o) => o.team == 'A')} />
                <Text>
                    vs.
                </Text>
                <Team team={gameDay.outcomes.filter((o) => o.team == 'B')} />
            </Flex>
        );
    }
    else {
        return (
            <Flex>
                <Title order={1}>Game {gameDay.id}: {gameDay.date.toDateString()}</Title>
                <Text>
                    No game {gameDay.comment ? `(${gameDay.comment})` : ''}
                </Text>
            </Flex>
        );
    }
};

export default GameDaySummary;
