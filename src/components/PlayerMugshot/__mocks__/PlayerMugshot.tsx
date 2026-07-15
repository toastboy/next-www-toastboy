import { Props } from '../PlayerMugshot';

export const PlayerMugshot = ({ onReady, ...props }: Props) => (
    <>
        <div>PlayerMugshot: {JSON.stringify(props)}</div>
        <button type="button" onClick={() => onReady?.()}>Mark PlayerMugshot ready</button>
    </>
);
PlayerMugshot.displayName = 'PlayerMugshot';
