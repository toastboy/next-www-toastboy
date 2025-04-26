import { Anchor } from '@mantine/core';
import gameDayService from 'services/GameDay';

export interface Props {
    gameDayId: number;
}

const GameDayLink: React.FC<Props> = async ({ gameDayId }) => {
    const gameDay = await gameDayService.get(gameDayId);

    if (!gameDay) return <></>;

    return (
        <Anchor href={`/footy/game/${gameDay.id}`} >
            {new Date(gameDay.date).toLocaleDateString('sv')}
        </Anchor>
    );
};

export default GameDayLink;
