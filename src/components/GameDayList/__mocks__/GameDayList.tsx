import { Props } from '../GameDayList';

export const GameDayList = (props: Props) => (
    <div>GameDayList: {JSON.stringify(props)}</div>
);
GameDayList.displayName = 'GameDayList';
