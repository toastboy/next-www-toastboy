import { Props } from '../GameDayLink';

const GameDayLink = ({ gameDay }: Props) => (
    <div>GameDayLink (gameDayId: {gameDay.id})</div>
);
GameDayLink.displayName = 'GameDayLink';
export default GameDayLink;
