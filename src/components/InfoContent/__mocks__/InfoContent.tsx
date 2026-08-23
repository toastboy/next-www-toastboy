import type { Props } from '../InfoContent';

export const InfoContent = (props: Props) => (
    <div>InfoContent: {JSON.stringify(props)}</div>
);
InfoContent.displayName = 'InfoContent';
