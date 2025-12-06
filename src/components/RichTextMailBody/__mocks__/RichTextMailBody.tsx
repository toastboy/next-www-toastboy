import { Props } from '../RichTextMailBody';

const RichTextMailBody = (props: Props) => (
    <div>RichTextMailBody: {JSON.stringify(props)}</div>
);
RichTextMailBody.displayName = 'RichTextMailBody';
export default RichTextMailBody;
