import type { Props } from '../StatusNotification';

export const StatusNotification = (props: Props) => (
    <div>StatusNotification: {JSON.stringify(props)}</div>
);
StatusNotification.displayName = 'StatusNotification';
