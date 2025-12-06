import { Props } from '../NavBarNested';

const NavBarNested = (props: Props) => (
    <div>NavBarNested: {JSON.stringify(props)}</div>
);
NavBarNested.displayName = 'NavBarNested';
export default NavBarNested;
