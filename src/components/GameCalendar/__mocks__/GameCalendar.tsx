import { Props } from '../GameCalendar';

const GameCalendar = (props: Props) => (
    <div>GameCalendar: {JSON.stringify(props)}</div>
);
GameCalendar.displayName = 'GameCalendar';
export default GameCalendar;
