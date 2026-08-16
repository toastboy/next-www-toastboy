import type { FootyChannel } from '@/types/FootyChannel';

interface Props {
    channels: FootyChannel | FootyChannel[];
}

/** Test mock for the AutoRefresh component. */
export const AutoRefresh = (props: Props) => (
    <div>AutoRefresh: {JSON.stringify(props)}</div>
);
AutoRefresh.displayName = 'AutoRefresh';
