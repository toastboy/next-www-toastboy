import { Props } from '../PlayerResults';

export const PlayerResults = (props: Props) => (
    <div>PlayerResults: {JSON.stringify(props)}</div>
);
PlayerResults.displayName = 'PlayerResults';
