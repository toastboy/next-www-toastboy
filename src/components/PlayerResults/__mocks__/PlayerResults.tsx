import { Props } from '../PlayerResults';

const PlayerResults = (props: Props) => (
    <div>PlayerResults: {JSON.stringify(props)}</div>
);
PlayerResults.displayName = 'PlayerResults';
export default PlayerResults;
