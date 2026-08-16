import { Props } from '../FamilyTreeShell';

export const FamilyTreeShell = (props: Props) => (
    <div>FamilyTreeShell: {JSON.stringify(props)}</div>
);
FamilyTreeShell.displayName = 'FamilyTreeShell';
