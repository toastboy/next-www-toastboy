import { Props } from '../HomeContent';

export const HomeContent = (props: Props) => (
    <div>HomeContent: {JSON.stringify(props)}</div>
);
HomeContent.displayName = 'HomeContent';
