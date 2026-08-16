import { FamilyTreeShell } from '@/components/FamilyTreeShell/FamilyTreeShell';
import playerService from '@/services/Player';

export const metadata = { title: 'Family Tree' };

/**
 * Server page that fetches the full player introduction hierarchy from the
 * Player service and passes it to {@link FamilyTreeShell} for rendering.
 */
const FamilyTreePage = async () => {
    const tree = await playerService.getFamilyTree();

    return <FamilyTreeShell data={tree} />;
};

export default FamilyTreePage;
