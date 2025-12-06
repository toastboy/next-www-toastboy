import { Props } from '../GameDaySummary';

const GameDaySummary = (props: Props) => (
    <div>GameDaySummary: {JSON.stringify(props)}</div>
);
GameDaySummary.displayName = 'GameDaySummary';
export default GameDaySummary;
