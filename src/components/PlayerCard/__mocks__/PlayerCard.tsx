import { Props } from '../PlayerCard';

export const PlayerCard = (props: Props) => (
    <div>PlayerCard: {JSON.stringify(props)}</div>
);
PlayerCard.displayName = 'PlayerCard';
