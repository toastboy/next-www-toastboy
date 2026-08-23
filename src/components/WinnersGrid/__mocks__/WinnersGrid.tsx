import type { Props } from '../WinnersGrid';

export const WinnersGrid = (props: Props) => (
    <div>WinnersGrid: {JSON.stringify(props)}</div>
);
WinnersGrid.displayName = 'WinnersGrid';
