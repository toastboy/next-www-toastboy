import type { MoneyFormProps } from '../MoneyForm';

export const MoneyForm = (props: MoneyFormProps) => (
    <div>MoneyForm: {JSON.stringify(props)}</div>
);
MoneyForm.displayName = 'MoneyForm';
