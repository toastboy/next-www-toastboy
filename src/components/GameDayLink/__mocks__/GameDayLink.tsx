import { Props } from '../GameDayLink';

const GameDayLink = ({ gameDay }: Props) => (
    <div>GameDayLink (id: {gameDay.id})</div>
);
GameDayLink.displayName = 'GameDayLink';
export default GameDayLink;
