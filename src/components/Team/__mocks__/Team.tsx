import { Props } from '../Team';

export const Team = (props: Props) => (
    <div>Team: {JSON.stringify(props)}</div>
);
Team.displayName = 'Team';
