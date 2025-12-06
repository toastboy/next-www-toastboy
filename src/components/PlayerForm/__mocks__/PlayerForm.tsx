import { Props } from '../PlayerForm';

const PlayerForm = (props: Props) => (
    <div>PlayerForm: {JSON.stringify(props)}</div>
);
PlayerForm.displayName = 'PlayerForm';
export default PlayerForm;
