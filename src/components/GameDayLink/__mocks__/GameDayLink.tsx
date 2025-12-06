import { Props } from '../GameDayLink';

const GameDayLink = (props: Props) => (
    <div>GameDayLink: {JSON.stringify(props)}</div>
);
GameDayLink.displayName = 'GameDayLink';
export default GameDayLink;
