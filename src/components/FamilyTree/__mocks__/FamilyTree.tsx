import { Props } from '../FamilyTree';

/** Test mock for the FamilyTree component. */
export const FamilyTree = (props: Props) => (
    <div data-testid="family-tree">FamilyTree: {JSON.stringify(props)}</div>
);
FamilyTree.displayName = 'FamilyTree';
