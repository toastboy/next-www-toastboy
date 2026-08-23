import type { Props } from '../InvoiceForm';

export const InvoiceForm = (props: Props) => (
    <div>InvoiceForm: {JSON.stringify(props)}</div>
);
InvoiceForm.displayName = 'InvoiceForm';
