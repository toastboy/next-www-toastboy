import { Props } from '../BreakpointDebugger';

export const BreakpointDebugger = (props: Props) => (
    <div>BreakpointDebugger: {JSON.stringify(props)}</div>
);
BreakpointDebugger.displayName = 'BreakpointDebugger';
