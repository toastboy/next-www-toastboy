import { Props } from '../CustomAppShell';

export const CustomAppShell = (props: Props) => (
    <div>CustomAppShell: {JSON.stringify(props)}</div>
);
CustomAppShell.displayName = 'CustomAppShell';
