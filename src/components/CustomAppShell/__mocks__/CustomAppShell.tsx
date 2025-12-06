import { Props } from '../CustomAppShell';

const CustomAppShell = (props: Props) => (
    <div>CustomAppShell: {JSON.stringify(props)}</div>
);
CustomAppShell.displayName = 'CustomAppShell';
export default CustomAppShell;
