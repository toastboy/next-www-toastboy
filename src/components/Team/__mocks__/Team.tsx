import { Props } from '../Team';

const Team = (props: Props) => (
    <div>Team: {JSON.stringify(props)}</div>
);
Team.displayName = 'Team';
export default Team;
