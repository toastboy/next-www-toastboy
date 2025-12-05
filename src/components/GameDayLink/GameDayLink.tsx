import { Anchor } from '@mantine/core';
import { GameDayType } from 'prisma/generated/schemas/models/GameDay.schema';

export interface Props {
    gameDay: GameDayType,
}

const GameDayLink: React.FC<Props> = ({ gameDay }) => {
    return (
        <Anchor href={`/footy/game/${gameDay.id}`} >
            {new Date(gameDay.date).toLocaleDateString('sv')}
        </Anchor>
    );
};

export default GameDayLink;
