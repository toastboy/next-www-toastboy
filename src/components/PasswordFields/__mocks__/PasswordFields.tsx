import { PasswordFieldsProps } from '../PasswordFields';

export const PasswordFields = (props: PasswordFieldsProps) => (
    <div>PasswordFields: {JSON.stringify(props)}</div>
);
PasswordFields.displayName = 'PasswordFields';
