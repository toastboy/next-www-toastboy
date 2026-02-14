import type { GameResultFormProps } from '../GameResultForm';

export const GameResultForm = (props: GameResultFormProps) => (
    <div>GameResultForm: {JSON.stringify(props)}</div>
);
GameResultForm.displayName = 'GameResultForm';
