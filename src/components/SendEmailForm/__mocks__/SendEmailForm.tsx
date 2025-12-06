import { Props } from '../SendEmailForm';

const SendEmailForm = (props: Props) => (
    <div>SendEmailForm: {JSON.stringify(props)}</div>
);
SendEmailForm.displayName = 'SendEmailForm';
export default SendEmailForm;
