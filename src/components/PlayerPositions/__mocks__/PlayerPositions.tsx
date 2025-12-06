import { Props } from '../PlayerPositions';

const PlayerPositions = (props: Props) => (
    <div>PlayerPositions: {JSON.stringify(props)}</div>
);
PlayerPositions.displayName = 'PlayerPositions';
export default PlayerPositions;
