import { Props } from '../EnquiryForm';

const EnquiryForm = (props: Props) => (
    <div>EnquiryForm: {JSON.stringify(props)}</div>
);
EnquiryForm.displayName = 'EnquiryForm';
export default EnquiryForm;
