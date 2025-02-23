import { Anchor } from '@mantine/core';
import { GameDay } from 'lib/types';

export interface Props {
    gameDay: GameDay;
}

const GameDayLink: React.FC<Props> = ({ gameDay }) => {
    return (
        <Anchor href={`/footy/game/${gameDay.id}`} >
            {new Date(gameDay.date).toLocaleDateString('sv')}
        </Anchor>
    );
};

export default GameDayLink;
