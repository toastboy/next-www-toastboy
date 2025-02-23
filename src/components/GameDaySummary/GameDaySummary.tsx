import { Container, Text } from '@mantine/core';
import GameDayLink from 'components/GameDayLink/GameDayLink';
import Team from 'components/Team/Team';
import { GameDayWithOutcomesWithPlayers } from 'lib/types';

interface Props {
    gameDay: GameDayWithOutcomesWithPlayers;
}

const GameDaySummary: React.FC<Props> = ({ gameDay }) => {
    if (gameDay.game) {
        return (
            // TODO: Use Mantine components
            <Container>
                <h1>Game {gameDay.id}: <GameDayLink gameDay={gameDay} /></h1>
                <Text>
                    {gameDay.comment ? `(${gameDay.comment})` : ''}
                </Text>
                <Team team={gameDay.outcomes.filter((o) => o.team == 'A')} />
                <Text>
                    vs.
                </Text>
                <Team team={gameDay.outcomes.filter((o) => o.team == 'B')} />
            </Container>
        );
    }
    else {
        return (
            <Text>
                No game {gameDay.comment ? `(${gameDay.comment})` : ''}
            </Text>
        );
    }
};

export default GameDaySummary;
