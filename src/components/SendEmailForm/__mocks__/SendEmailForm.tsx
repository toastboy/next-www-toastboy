import { Props } from '../SendEmailForm';

export const SendEmailForm = ({ opened, onClose, ...props }: Props) => (
    <>
        <div>SendEmailForm: {JSON.stringify({ opened, ...props })}</div>
        {!!opened && <button type="button" onClick={() => onClose?.()}>Close SendEmailForm</button>}
    </>
);
SendEmailForm.displayName = 'SendEmailForm';
