import { Props } from '../TeamPlayer';

const TeamPlayer = (props: Props) => (
    <div>TeamPlayer: {JSON.stringify(props)}</div>
);
TeamPlayer.displayName = 'TeamPlayer';
export default TeamPlayer;
