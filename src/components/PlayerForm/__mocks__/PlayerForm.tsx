import { Props } from '../PlayerForm';

const PlayerForm = ({ form, games }: Props) => (
    <div>PlayerForm (form: {form.length}, games: {games})</div>
);
PlayerForm.displayName = 'PlayerForm';
export default PlayerForm;
