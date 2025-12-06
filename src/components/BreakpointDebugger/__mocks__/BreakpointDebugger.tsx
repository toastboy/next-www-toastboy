import { Props } from '../BreakpointDebugger';

const BreakpointDebugger = (props: Props) => (
    <div>BreakpointDebugger: {JSON.stringify(props)}</div>
);
BreakpointDebugger.displayName = 'BreakpointDebugger';
export default BreakpointDebugger;
