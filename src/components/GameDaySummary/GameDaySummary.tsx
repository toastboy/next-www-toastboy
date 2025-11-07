import { Flex, Text, Title } from '@mantine/core';
import Team from 'components/Team/Team';
import { GameDayType } from 'prisma/generated/schemas/models/GameDay.schema';
import outcomeService from 'services/Outcome';

interface Props {
    gameDay: GameDayType;
}

const GameDaySummary: React.FC<Props> = async ({ gameDay }) => {
    if (gameDay.game) {
        const outcomes = await outcomeService.getByGameDay(gameDay.id);

        return (
            <Flex direction="column">
                <Title order={1}>Game {gameDay.id}: {gameDay.date.toDateString()}</Title>
                <Text>
                    {gameDay.comment ? `(${gameDay.comment})` : ''}
                </Text>
                <Team team={outcomes.filter((o) => o.team == 'A')} />
                <Text>
                    vs.
                </Text>
                <Team team={outcomes.filter((o) => o.team == 'B')} />
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
