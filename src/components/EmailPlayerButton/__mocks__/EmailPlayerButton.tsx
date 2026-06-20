import { Props } from '../EmailPlayerButton';

export const EmailPlayerButton = ({ player, ...props }: Props) => (
    <>
        <div>EmailPlayerButton: {JSON.stringify({ player, ...props })}</div>
    </>
);
EmailPlayerButton.displayName = 'EmailPlayerButton';
