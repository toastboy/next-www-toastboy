import { Props } from '../PlayerArse';

const PlayerArse = (props: Props) => (
    <div>PlayerArse: {JSON.stringify(props)}</div>
);
PlayerArse.displayName = 'PlayerArse';
export default PlayerArse;
