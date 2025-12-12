import { Props } from '../PlayerForm';

export const PlayerForm = (props: Props) => (
    <div>PlayerForm: {JSON.stringify(props)}</div>
);
PlayerForm.displayName = 'PlayerForm';
